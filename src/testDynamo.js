'use strict';

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
        // this.ddb = new this.AWS.DynamoDB.DocumentClient();
    }

    put(params) {
        console.log("Adding a new item...");
        this.ddb.putItem(params, function (err, data) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            console.log("Added item:", JSON.stringify(data, null, 2));
        });
    }

    // listTables() {
    //     var param = {}
    //     this.ddb.ListTables(param, function (err, data) {
    //         if (err) console.log(err, err.stack); // an error occurred
    //         else console.log(data);           // successful response
    //     });
    // }
}

let dm = new DynamoManager('eu-west-1');
var params = {
    // TableName: "test2",
    TableName: "chat-history",
    Item: {
        "creationDate": {S: "1608879543"},
        "expDate": {S: "1608889543"},
        "msg": {S: "test message 2"},
        "msgId": {S: "1608879543-testSender"},
        "msgType": {S: "chat"},
        "ownerId": {S: "testOwner"},
        "roomId": {S: "roomTest"},
        "sender": {S: "testSender"},
        "senderNickname": {S: "testNickname"},
    }
};

// dm.listTables();
dm.put(params);