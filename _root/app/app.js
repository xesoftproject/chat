const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const lgg = require("./custom-logger");
const jwtValidator = require("./jwtValidator");
const dynamo = require("./dynamo");
const ping = require("./ping");
const configuration = require("./configuration");


var fs = require('fs');
// var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/www.xesoft.ml/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/www.xesoft.ml/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

//TODO fa digerire ad app le credentials
const app = module.exports = express();
// your express configuration here
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
// httpServer.listen(3000);
httpsServer.listen(3000);

const logger = new lgg({
    level: 'debug',
    common: [
        {"service": "chat"}
    ]
});
const TIMEOUT_5_MINUTI = 5 * 60 * 1000
app.set('port', process.env.PORT || 3001);
const server = app.listen(app.get('port'), () => {
    logger.info('Chat listening on port ' + app.get('port'));
});
const io_s = require('socket.io')(server);
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
    } catch (err) {
        logger.error(`Error on join: ${err}`);
    }

}, TIMEOUT_5_MINUTI);

(async function app() {
    try {
        config = await configuration.readConfigFile(configUrl);
        logger.setLogLevel(config.logging.loggers['chat'] || config.logging.level || "DEBUG");
        logger.warn("DEBUGGING ACTIVE: this log must be visibile only in local env. NOT FOR TEST OR PRODUCTION")
        initializeViewEngine();
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
        var dm = new dynamo(config.awsDynamoChatRegion);

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
            const roomId = "666"; //TODO
            logger.info(`room-manager room id: ${roomId}, socket id: ${socket.id}, nickname: ${data.nickname}`);

            try {

                if (data.message.length > config.chatMaxLengthMsg) {
                    throw("Exceeded the maximum length of the message (" + config.chatMaxLengthMsg + " characters)");
                }

                var decodedJwt = validateJWT(jwtToken, config.awsUserPoolId, config.awsServiceRegion, config.awsJwks, roomId);

                const creationDate = Date.now();
                const expDate = creationDate + 1000 * 60 * 60 * config.chatTTLInH

                var params = {
                    TableName: config.awsDynamoChatHistoryTableName,
                    Item: {
                        "creationDate": {S: "" + creationDate},
                        "expDate": {S: "" + expDate},
                        "msg": {S: data.message},
                        "msgId": {S: creationDate + "-" + decodedJwt.payload['cognito:username']},
                        "roomId": {S: roomId},
                        "sender": {S: decodedJwt.payload['cognito:username']},
                        "senderNickname": {S: data.nickname}
                    }
                };
                dm.put(params);
                io.in(roomId).emit('message', {"message": data.message, "nickname": data.nickname, "username": decodedJwt.payload['cognito:username'], "creationDate": creationDate});
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
    //TODO check sulla room ma non tramite jwt
    // if (roomId != decodedJwt.payload['custom:eventId']) {
    //     throw("Room requested does not match jwt custom:eventId");
    // }
    return decodedJwt;
}

// view engine setup, so that you can easily debug locally
function initializeViewEngine() {
    logger.info("Initializing view engine: ONLY FOR DEBUGGING PURPOSE!");
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/', (req, res) => {
        res.render('index');
    });
}

app.get('/ping.html', ping());
