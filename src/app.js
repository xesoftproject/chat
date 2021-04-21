const express = require('express');
const CryptoJS = require('crypto-js')
const bodyParser = require('body-parser');
const path = require('path');
const lgg = require("./custom-logger");
const jwtValidator = require("./jwtValidator");
const dynamo = require("./dynamo");
// const s3 = require("./s3");
const cognito = require("./cognito");
const ping = require("./ping");
const configuration = require("./configuration");

const fs = require('fs');
const logger = new lgg({
    level: 'debug',
    common: [
        {"service": "chat"}
    ]
});

// *** HTTPS ***
var https = require('https');
var privateKey = fs.readFileSync('_root/app/privkey.pem', 'utf8');
var certificate = fs.readFileSync('_root/app/cert.pem', 'utf8');
// var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.xesoft.ml/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/www.xesoft.ml/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const app = module.exports = express();
var cognitoManager;

// var s3Params = {Bucket: 'xesoft-configuration', Key: 'xesoft_chat_accessKeys_enc.json'};
// const AWS = require("aws-sdk");
// new AWS.S3().getObject(s3Params, function (err, data) {
//     if (!err)
//         logger.info(data.Body.toString());
//     else
//         logger.error(err);
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/clave', (req, res) => {
    var encrypted = "U2FsdGVkX1/vaEvT3cmlJciMporrBIcEC6IfTpeA5nFPuCzx6ckSoliJsUkx/QMzbAude6HpG8INr5vAhqeDV5Yi3DEIT+28VVk9cVe9mHXYNrfYfNEMaED9RQbccuEZac8PIuQFc8RjZHSh3AG8ktTJAcZKZCMOeoYw6jUm2Mo=";
    var mypwd = process.env.MYPWD;
    var decrypted = CryptoJS.AES.decrypt(encrypted, mypwd);
    var strDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
    res.send(strDecrypted);
});
app.get('/user/delete', function (req, res) {
    var password = req.body.password;
    res.send('User deleted');
});
app.post('/user/signup', function (req, res) {
    var nickname = req.body.nickname;
    var email = req.body.email;
    var pass = req.body.pass;
    var profile = "player";
    cognitoManager.createUser(nickname, email, profile, pass);

    res.send("Registered as:" + email + ' ' + nickname);
});
const serverXE = https.createServer(credentials, app)
    .listen(3001, function () {
        console.log('Example app listening on port 3000! Go to https://www.xesoft.ml:3001/login.html')
    });
const TIMEOUT_5_MINUTI = 5 * 60 * 1000

const io_s = require('socket.io')(serverXE);
const configUrl = process.env["CONFIG_URL"];

let config;

logger.info("Starting service packager...");

const reloadConfigInterval = setInterval(async function () {
    logger.trace(`Reloading config...`);
    try {
        let newConfig = await configuration.readConfigFile(configUrl);

        if (newConfig.version == config.version && newConfig.versionServicePackager == config.versionServicePackager) {
            logger.trace(`No changes in config.`);
            return;
        }
        logger.info(`Loading new config... global:${config.version} -> ${newConfig.version} - service: ${config.versionServiceChat} -> ${newConfig.versionServiceChat}`);
        config = newConfig;
        logger.setLogLevel(config.logging.loggers['filmbank~service~chat'] || config.logging.level || "TRACE");
        cognitoManager = new cognito(config.awsUserPoolId);
    } catch (err) {
        logger.error(`Error on join: ${err}`);
    }

}, TIMEOUT_5_MINUTI);

(async function app() {
    try {
        config = await configuration.readConfigFile(configUrl);
        // config = await configuration.readConfigFile("C:\\Users\\dario.brambilla\\Documents\\ws\\xesoft\\chat\\config.yml");//"configUrl);
        logger.setLogLevel(config.logging.loggers['chat'] || config.logging.level || "DEBUG");
        logger.warn("DEBUGGING ACTIVE: this log must be visibile only in local env. NOT FOR TEST OR PRODUCTION")
        // initializeViewEngine();
        cognitoManager = new cognito(config.awsUserPoolId);
    } catch
        (err) {
        logger.error(`Error: ${err}`);
        if (reloadConfigInterval) {
            clearInterval(reloadConfigInterval);
        }
    }

    const io = io_s.of("/" + config.chatNamespace);
    var dm = new dynamo(config.awsDynamoChatRegion);

    io.on('connection', (socket) => {
        // var dm = new dynamo(config.awsDynamoChatRegion);

        socket.on('join', (data) => {
            try {
                const roomId = data.room;
                logger.info(`socket ${socket.id} joining room ${roomId}`);
                const jwtToken = data.jwt;

                validateJWT(jwtToken, config.awsUserPoolId, config.awsServiceRegion, config.awsJwks, roomId);

                socket.join(roomId);
                io.in(roomId).emit('message', `Socket ${socket.id} joined to room ${roomId}`);
            } catch (err) {
                logger.error(`Error joining: ${err}`);
                socket.emit('errorMsg', {description: err});
            }
        });

        socket.on('room-manager', (data) => {
            const jwtToken = data.jwt;
            const roomId = data.room;
            const msgType = data.msgType;
            logger.info(`room-manager room id: ${roomId}, socket id: ${socket.id}, msg type: ${msgType}`);

            try {
                if (msgType != "chat") {
                    throw("INVALID Message type \"" + msgType + "\"");
                }

                if (data.message.length > config.chatMaxLengthMsg) {
                    throw("Exceeded the maximum length of the message (" + config.chatMaxLengthMsg + " characters)");
                }

                var decodedJwt = validateJWT(jwtToken, config.awsUserPoolId, config.awsServiceRegion, config.awsJwks, roomId);

                const creationDate = Date.now();
                const expDate = creationDate + 1000 * 60 * 60 * config.chatTTLInH;

                var params = {
                    TableName: config.awsDynamoEnv + "-" + config.awsDynamoChatHistoryTableName,
                    Item: {
                        "creationDate": {S: "" + creationDate},
                        "expDate": {S: "" + expDate},
                        "msg": {S: data.message},
                        "msgId": {S: creationDate + "-" + decodedJwt.payload['cognito:username']},
                        "msgType": {S: msgType},
                        // "ownerId": {S: "decodedJwt.payload.ownerId"},
                        "roomId": {S: roomId},
                        "sender": {S: decodedJwt.payload['cognito:username']},
                        "senderNickname": {S: decodedJwt.payload['nickname']},
                    }
                };
                // dm.put(params);
                io.in(roomId).emit('message', {"message": data.message, "nickname": decodedJwt.payload['nickname'], "username": decodedJwt.payload['cognito:username'], "creationDate": creationDate});
            } catch (err) {
                logger.error(`room-manager error: ${err}`);
                socket.emit('errorMsg', {description: err});
            }
        });

        socket.on('error', (reason) => {
            logger.error(reason);
        });

    });

})
();

function validateJWT(jwtToken, awsUserPoolId, awsServiceRegion, awsJwks, roomId) {
    var validation = jwtValidator(jwtToken, awsUserPoolId, awsServiceRegion, awsJwks)
    var isValidated = validation[0];
    if (!isValidated) {
        throw("JWT provided NOT valid.");
    }
    var decodedJwt = validation[1];
    //TODO: trovare un modo per legare la room alla partita
    // if (roomId != decodedJwt.payload['custom:eventId']) {
    //     throw("Room requested does not match jwt custom:eventId");
    // }
    return decodedJwt;
}

app.get('/ping.html', ping());

