'use strict';

const lgg = require('./custom-logger');
const logger = new lgg({
    level: 'info',
    common: [{service: 'chat'}]
});

/*
 * Manage connection to Dynamo and provide persistence method
 */

class DynamoManager {
    constructor(region, accessKey, secretKey) {
    // constructor(region) {
        this.AWS = require('aws-sdk');

        // Set the region
        this.AWS.config.update({
            region: region,
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        });

        // Set the region
        // this.AWS.config.update({
        //     region: region,
        //     accessKeyId: process.env.ACCESS_KEY_ID,
        //     secretAccessKey: process.env.SECRET_ACCESS_KEY
        // });

        // Create the DynamoDB service object
        this.ddb = new this.AWS.DynamoDB({apiVersion: '2012-08-10'});
    }

    put(params) {
        logger.info(`Adding a new item... ${JSON.stringify(params)}`);
        this.ddb.putItem(params, function (err, data) {
            if (err) {
                throw `Unable to add item. Error JSON: ${JSON.stringify(
                    err,
                    null,
                    2
                )}`;
            } else {
                logger.debug('Added item:', JSON.stringify(data, null, 2));
            }
        });
    }

    get(params) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ddb.query(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }, 5000);
        });
    }

}

module.exports = DynamoManager;
