const yaml = require('yaml-js');
const fetch = require('node-fetch');
const fs = require('fs');
const Request = fetch.Request;
const Response = fetch.Response;
const lgg = require('./custom-logger');
const logger = new lgg({
    level: 'debug',
    common: [{service: 'chat'}]
});

localAndRemotefetch = function (url, options) {
    const request = new Request(url, options);
    if (request.url.substring(0, 4) != 'http') {
        return new Promise((resolve, reject) => {
            const filePath = url;
            if (!fs.existsSync(filePath)) {
                reject(`Not found: ${filePath}`);
            }
            const readStream = fs.createReadStream(filePath);
            readStream.on('open', function () {
                resolve(
                    new Response(readStream, {
                        url: request.url,
                        status: 200,
                        statusText: 'OK',
                        size: fs.statSync(filePath).size,
                        timeout: request.timeout,
                        ok: true
                    })
                );
            });
            logger.debug('Completed response for local conf file.');
        });
    } else {
        return fetch(url, options);
    }
};

async function readConfigFile(url) {
    try {
        logger.trace(`Fetching config file: '${url}'`);

        // let res = await fetch(url);
        let res = await localAndRemotefetch(url);

        if (!(await res.ok)) {
            // res.status >= 200 && res.status < 300
            throw `Error fetching '${res.url}', HTTP Status:'${res.status} - ${res.statusText}'`;
        }
        logger.trace(`Config file fetched: '${url}'`);

        let text = await res.text();
        let json = yaml.load(text);

        logger.trace(
            `Config file parsed - versionServicePackager: ${json.versionServicePackager}`
        );
        return json;
    } catch (err) {
        logger.error(err);
    }
}

module.exports.readConfigFile = readConfigFile;
module.exports.localAndRemotefetch = localAndRemotefetch;
