'use strict';

/*
 *   This function validate and check the JWK
 *   Return false in case anyone of the checks fails
 *   Return true in case all the checks are successful
 */

const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const lgg = require('./custom-logger');
const logger = new lgg({
    level: 'info',
    common: [{service: 'chat'}]
});

function validate(jwtToken, userPoolId, region, JWKS) {
    var iss = 'https://cognito-idp.' + region + '.amazonaws.com/' + userPoolId;
    //logger.debug("iss: ", iss)
    var pems;

    pems = {};
    var keys = JWKS.keys;
    for (var ii = 0; ii < keys.length; ii++) {
        //Convert each key to PEM
        var key_id = keys[ii].kid;
        var modulus = keys[ii].n;
        var exponent = keys[ii].e;
        var key_type = keys[ii].kty;
        var jwk = {kty: key_type, n: modulus, e: exponent};
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
    }

    //logger.debug('Authorizing by jwtCookie: USERPOOLID=' + userPoolId + ' - region=' + region + ' - pems=' + pems);
    //logger.debug('jwtToken=' + jwtToken);

    //Fail if the token is not jwt
    var decodedJwt = jwt.decode(jwtToken, {complete: true});
    if (!decodedJwt) {
        logger.error('Not a valid JWT token');
        return false;
    }

    //Fail if token is not from your UserPool
    if (decodedJwt.payload.iss != iss) {
        logger.error('Invalid issuer');
        return false;
    }

    //Reject the jwt if it's not an 'Id Token'
    if (decodedJwt.payload.token_use != 'id') {
        logger.error('Not an access token');
        return false;
    }

    //Get the kid from the token and retrieve corresponding PEM
    var kid = decodedJwt.header.kid;
    var pem = pems[kid];
    if (!pem) {
        logger.error('Invalid access token');
        return false;
    }

    //Verify the signature of the JWT token to ensure it's really coming from your User Pool
    return jwt.verify(jwtToken, pem, {issuer: iss}, function (err, payload) {
        if (err) {
            logger.error('Token failed verification: ' + err);
            return false;
        } else {
            //Valid token.
            logger.debug('JWT validation successfully.');
            return [true, decodedJwt];
        }
    });
}

module.exports = validate;
