'use strict';

const lgg = require("./custom-logger");
const logger = new lgg({
    level: 'info',
    common: [
        {"service": "chat"}
    ]
});


/*
* Manage connection to Dynamo and provide persistence method
*/

class DynamoManager {

    constructor(region) {
        this.AWS = require("aws-sdk");

        // Set the region
        this.AWS.config.update({region: 'eu-west-1', accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY});

        // Create the DynamoDB service object
        this.ddb = new this.AWS.DynamoDB({apiVersion: '2012-08-10'});
    }

    put(params) {
        logger.info(`Adding a new item... ${JSON.stringify(params)}`);
        this.ddb.putItem(params, function (err, data) {
            if (err) {
                throw `Unable to add item. Error JSON: ${JSON.stringify(err, null, 2)}`;
            } else {
                logger.debug("Added item:", JSON.stringify(data, null, 2));
            }
        });
    }
}

module.exports = DynamoManager;