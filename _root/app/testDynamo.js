'use strict';

/*
* Manage connection to Dynamo and provide persistence method
*/

class DynamoManager {

    constructor(region) {
        this.AWS = require("aws-sdk");

        // Set the region
        this.AWS.config.update({region: 'eu-west-1'});

        // Create the DynamoDB service object
        this.ddb = new this.AWS.DynamoDB({apiVersion: '2012-08-10'});
        // this.ddb = new this.AWS.DynamoDB.DocumentClient();
    }

    // list(){
    //     this.ddb.listTables(function (err, data){
    //         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));}
    // })


    put(params) {
        console.log("Adding a new item...");
        this.ddb.putItem(params, function (err, data) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            console.log("Added item:", JSON.stringify(data, null, 2));
        });
    }
}


let dm = new DynamoManager('eu-west-1');
var params = {
    TableName:"chat-history",
    Item:{
        "creationDate": {S:"16052007661"},
        "expDate": {S:"1636776660"},
        "msg": {S:"third message"},
        "msgId": {S:"1605200000-Dario"},
        "msgType": {S:"chat"},
        "ownerId": {S:"cinema000001"},
        "roomId": {S:"room100"},
        "sender": {S:"Dario"},
        "senderNickname": {S:"DarioSuperstar"}
    }
};
// .listTables(function (err, data) {
dm.put(params);