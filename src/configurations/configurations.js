const { hostname } = require('os');
const { load } = require('yaml-js');
const { readFileSync } = require('fs');

const EC2_HOSTNAME = 'ip-172-31-36-240';

const { PRIVKEY_PATH, CERT_PATH, HTTP, WS, HOSTNAME, REST_PORT } = require(hostname() === EC2_HOSTNAME ? './aws' : './local');

const CONFIG_PATH = process.env['CONFIG_URL'] || 'config.yml';

const CREDENTIALS = {
	key: readFileSync(PRIVKEY_PATH, 'utf8'),
	cert: readFileSync(CERT_PATH, 'utf8')
};

module.exports.CONFIG = load(readFileSync(CONFIG_PATH, 'utf-8'));
module.exports.CREDENTIALS = CREDENTIALS;
module.exports.HTTP = HTTP;
module.exports.WS = WS;
module.exports.HOSTNAME = HOSTNAME;
module.exports.REST_PORT = REST_PORT;
