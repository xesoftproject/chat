'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const https = require('https');
const socket_io = require('socket.io');

const {CognitoManager} = require('./cognito');
const {CONFIG, CREDENTIALS, HTTP, WS, HOSTNAME, REST_PORT} = require('./configurations/configurations');
const lgg = require('./custom-logger');
const dynamo = require('./dynamo');
const jwtValidator = require('./jwtValidator');

const logger = new lgg({
    level: CONFIG.logging.loggers['chat'] || CONFIG.logging.level || 'DEBUG',
    common: [{service: 'chat'}]
});

const app = express();
const cognitoManager = new CognitoManager(CONFIG.awsUserPoolId);
const dm = new dynamo(CONFIG.awsDynamoChatRegion);

const PRIVATE_PAGES = ['/', '/game.html', '/home.html', '/index.html'];
const LOGIN_PAGE = '/login.html';

var socketUsers = {};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())


app.all('*', (req, res, next) => {
    console.log('ALL *');

    const is_public = !PRIVATE_PAGES.includes(req.path);
    const is_logged = req.cookies['CognitoIdentityServiceProvider.6vligtquo88fguj7e5dsr6mlmj.LastAuthUser'];
    // TODO: verify jwt, extract username, etc
    const is_logged_login = is_logged && LOGIN_PAGE === req.path;

    console.log('[is_public: %o, is_logged: %o, is_logged_login: %o]',
        is_public, is_logged, is_logged_login);

    if (is_public || is_logged)
        next();
    else if (is_logged_login)
        res.redirect('/');
    else
        res.redirect(LOGIN_PAGE);
});

// TODO: use a template engine?
app.get('/js/configuration.js', (_, res) => {
    console.log('GET /js/configuration.js');

    res.type('.js').send(`export const HOSTNAME = '${HOSTNAME}';`);
});

app.use('/', express.static('web'));

app.get('/user/delete', (req, res) => {
    var password = req.body.password;
    //todo
    res.send('User deleted');
});

app.post('/user/signup', (req, res) => {
    var nickname = req.body.nickname;
    var email = req.body.email;
    var pass = req.body.pass;
    var profile = 'player';

    cognitoManager.createUser(nickname, email, profile, pass);

    res.send('Registered as:' + email + ' ' + nickname);
});

const io = socket_io(https.createServer(CREDENTIALS, app).listen(443)).of('/' + CONFIG.chatNamespace);

io.on('connection', (socket) => {

    // socket.on("disconnect", function()  {
    // 	// socketUsers.delete(socket.id);
    // 	// console.info(`Client gone [id=${socket.id}]`);
    // 	if (socket==undefined || socket=="transport close" || socket == "ping timeout")
    // 		return;
    // 	console.log('Got disconnect!');
    // 	var i = socketUsers.indexOf(socket);
    // 	socketUsers.splice(i, 1);
    // });

    socket.on('join', (data) => {
        try {
            const roomId = data.room;
            logger.info(`socket ${socket.id} joining room ${roomId}`);
            const jwtToken = data.jwt;

            var decodedJwt = validateJWT(
                jwtToken,
                CONFIG.awsUserPoolId,
                CONFIG.awsServiceRegion,
                CONFIG.awsJwks,
                roomId
            );

            socket.join(roomId);
            socketUsers[socket.id] = decodedJwt.payload['nickname'];

            var params = {
                ExpressionAttributeValues: {
                    ':r': {S: roomId}
                },
                KeyConditionExpression: 'roomId = :r ',
                ProjectionExpression: 'msg, senderNickname, creationDate',
                TableName: 'chat-history'
            };

            dm.get(params)
                .then(data => {
                    data.Items.forEach(function (element, index, array) {
                        console.log(element);
                    });
                    io.in(roomId).emit(
                        'message',
                        `Socket ${socket.id} joined to room ${roomId}`
                    );
                    logger.info(` emitting history vs socket.id: ${socket.id}`);
                    io.sockets[socket.id].emit('history', data);
                })
                .catch(err => console.log("Error", err));

        } catch (err) {
            logger.error(`Error joining: ${err}`);
            socket.emit('errorMsg', {description: err});
        }
    });

    socket.on('room-manager', (data) => {
        const jwtToken = data.jwt;
        const roomId = data.room;
        const msgType = data.msgType;
        logger.info(
            `room-manager room id: ${roomId}, socket id: ${socket.id}, msg type: ${msgType}`
        );

        try {
            if (msgType != 'chat') {
                throw 'INVALID Message type "' + msgType + '"';
            }

            if (data.message.length > CONFIG.chatMaxLengthMsg) {
                throw (
                    'Exceeded the maximum length of the message (' +
                    CONFIG.chatMaxLengthMsg +
                    ' characters)'
                );
            }

            var decodedJwt = validateJWT(
                jwtToken,
                CONFIG.awsUserPoolId,
                CONFIG.awsServiceRegion,
                CONFIG.awsJwks,
                roomId
            );

            const creationDate = Date.now();
            const expDate = creationDate + 1000 * 60 * 60 * CONFIG.chatTTLInH;

            var params = {
                TableName:
                // CONFIG.awsDynamoEnv +
                // '-' +
                CONFIG.awsDynamoChatHistoryTableName,
                Item: {
                    creationDate: {S: '' + creationDate},
                    expDate: {S: '' + expDate},
                    msg: {S: data.message},
                    msgId: {
                        S:
                            creationDate +
                            '-' +
                            decodedJwt.payload['cognito:username']
                    },
                    msgType: {S: msgType},
                    // "ownerId": {S: "decodedJwt.payload.ownerId"},
                    roomId: {S: roomId},
                    sender: {S: decodedJwt.payload['cognito:username']},
                    senderNickname: {S: decodedJwt.payload['nickname']}
                }
            };
            dm.put(params);
            io.in(roomId).emit('message', {
                message: data.message,
                nickname: decodedJwt.payload['nickname'],
                username: decodedJwt.payload['cognito:username'],
                creationDate: creationDate
            });
        } catch (err) {
            logger.error(`room-manager error: ${err}`);
            socket.emit('errorMsg', {description: err});
        }
    });

    socket.on('error', (reason) => {
        logger.error(reason);
    });

    socket.on('play_with_me_room', (data) => {
        const jwtToken = data.jwt;
        const roomId = data.room;
        const msgType = data.msgType;
        const message = data.message;
        const theLink = data.link;
        const receiverNickname = data.nickname;
        logger.info(
            `play_with_me_room room id: ${roomId}, socket id: ${socket.id}, msg type: ${msgType}`
        );
        try {
            if (msgType != 'command') {
                throw 'INVALID Message type "' + msgType + '"';
            }
            // if (message.length > CONFIG.chatMaxLengthMsg) {
            // 	throw (
            // 		'Exceeded the maximum length of the message (' +
            // 		CONFIG.chatMaxLengthMsg +
            // 		' characters)'
            // 	);
            // }
            var decodedJwt = validateJWT(
                jwtToken,
                CONFIG.awsUserPoolId,
                CONFIG.awsServiceRegion,
                CONFIG.awsJwks,
                roomId
            );

            var clients = io.adapter.rooms[roomId].sockets;
            var receiverSocketID = null;
            for (const [key, value] of Object.entries(clients)) {
                if (socketUsers[key] == receiverNickname) {
                    receiverSocketID = key;
                    break;
                }
            }

            if (receiverSocketID == null) {
                socket.emit('play_with_me_room', {
                    error: "User NOT FOUND",
                    creationDate: Date.now()
                });
            } else {
                logger.info(`receiverSocketID: ${receiverSocketID} message with theLink = ${theLink}`);
                io.sockets[receiverSocketID].emit('invitation', {
                    from: decodedJwt.payload.nickname,
                    link: theLink
                });
            }
        } catch (err) {
            logger.error(`play_with_me_room error: ${err}`);
            socket.emit('errorMsg', {description: err});
        }
    });

    socket.on('room-users-list', (data) => {
        const jwtToken = data.jwt;
        const roomId = data.room;
        const msgType = data.msgType;
        logger.info(
            `room-users-list room id: ${roomId}, socket id: ${socket.id}, msg type: ${msgType}`
        );
        try {
            if (msgType != 'command') {
                throw 'INVALID Message type "' + msgType + '"';
            }

            var decodedJwt = validateJWT(
                jwtToken,
                CONFIG.awsUserPoolId,
                CONFIG.awsServiceRegion,
                CONFIG.awsJwks,
                roomId
            );

            var clients = io.adapter.rooms[roomId].sockets;

            let usersListInReturn = [];

            let i = 0

            for (const [key, value] of Object.entries(clients)) {
                if (socketUsers[key] != decodedJwt.payload.nickname)
                    usersListInReturn.push(socketUsers[key]);
            }


            //send a message containing the users's nickname list to the sender
            socket.emit('room-users-list', {
                users: usersListInReturn,
                nickname: decodedJwt.payload['nickname'],
                username: decodedJwt.payload['cognito:username'],
                creationDate: Date.now()
            });
        } catch (err) {
            logger.error(`roomUsersList error: ${err}`);
            socket.emit('errorMsg', {description: err});
        }
    });
});

function validateJWT(
    jwtToken,
    awsUserPoolId,
    awsServiceRegion,
    awsJwks,
    roomId
) {
    var validation = jwtValidator(
        jwtToken,
        awsUserPoolId,
        awsServiceRegion,
        awsJwks
    );
    var isValidated = validation[0];
    if (!isValidated) {
        throw 'JWT provided NOT valid.';
    }
    var decodedJwt = validation[1];
    //TODO: trovare un modo per legare la room alla partita
    // if (roomId != decodedJwt.payload['custom:eventId']) {
    //     throw("Room requested does not match jwt custom:eventId");
    // }
    return decodedJwt;
}
