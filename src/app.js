'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const https = require('https');
const socket_io = require('socket.io');

const cognito = require('./cognito');
const { CONFIG, CREDENTIALS } = require('./configurations/configurations');
const lgg = require('./custom-logger');
const dynamo = require('./dynamo');
const jwtValidator = require('./jwtValidator');

const logger = new lgg({
	level: CONFIG.logging.loggers['chat'] || CONFIG.logging.level || 'DEBUG',
	common: [{ service: 'chat' }]
});

const app = express();
const cognitoManager = new cognito(CONFIG.awsUserPoolId);
const dm = new dynamo(CONFIG.awsDynamoChatRegion);

const PRIVATE_PAGES = ['/room.html', '/game.html'];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


app.all('*', (req, res, next) => {
	console.log('ALL *');

	console.log('[req.path: %o]', req.path)
	console.log('[req.cookies: %o]', req.cookies)

	const is_public = !PRIVATE_PAGES.includes(req.path);
	const is_logged = req.cookies['CognitoIdentityServiceProvider.6vligtquo88fguj7e5dsr6mlmj.LastAuthUser'];
	// TODO: verify jwt, extract username, etc

	console.log('[is_public: %o]', is_public)
	console.log('[is_logged: %o]', is_logged)

	if (is_public || is_logged)
		next();
	else
		res.redirect('/login.html');
});
app.use('/', express.static('web'));


// TODO ?
app.get('/user/delete', (req, res) => {
	var password = req.body.password;
	res.send('User deleted');
});

app.post('/user/signup', function(req, res) {
	var nickname = req.body.nickname;
	var email = req.body.email;
	var pass = req.body.pass;
	var profile = 'player';
	cognitoManager.createUser(nickname, email, profile, pass);

	res.send('Registered as:' + email + ' ' + nickname);
});

const serverXE = https.createServer(CREDENTIALS, app).listen(443);
const io_s = socket_io(serverXE);

const io = io_s.of('/' + CONFIG.chatNamespace);

io.on('connection', (socket) => {
	socket.on('join', (data) => {
		try {
			const roomId = data.room;
			logger.info(`socket ${socket.id} joining room ${roomId}`);
			const jwtToken = data.jwt;

			validateJWT(
				jwtToken,
				CONFIG.awsUserPoolId,
				CONFIG.awsServiceRegion,
				CONFIG.awsJwks,
				roomId
			);

			socket.join(roomId);
			io.in(roomId).emit(
				'message',
				`Socket ${socket.id} joined to room ${roomId}`
			);
		} catch (err) {
			logger.error(`Error joining: ${err}`);
			socket.emit('errorMsg', { description: err });
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
					CONFIG.awsDynamoEnv +
					'-' +
					CONFIG.awsDynamoChatHistoryTableName,
				Item: {
					creationDate: { S: '' + creationDate },
					expDate: { S: '' + expDate },
					msg: { S: data.message },
					msgId: {
						S:
							creationDate +
							'-' +
							decodedJwt.payload['cognito:username']
					},
					msgType: { S: msgType },
					// "ownerId": {S: "decodedJwt.payload.ownerId"},
					roomId: { S: roomId },
					sender: { S: decodedJwt.payload['cognito:username'] },
					senderNickname: { S: decodedJwt.payload['nickname'] }
				}
			};
			// dm.put(params);
			io.in(roomId).emit('message', {
				message: data.message,
				nickname: decodedJwt.payload['nickname'],
				username: decodedJwt.payload['cognito:username'],
				creationDate: creationDate
			});
		} catch (err) {
			logger.error(`room-manager error: ${err}`);
			socket.emit('errorMsg', { description: err });
		}
	});

	socket.on('error', (reason) => {
		logger.error(reason);
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
