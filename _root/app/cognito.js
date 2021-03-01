'use strict';
const passGen = require('generate-password');
const lgg = require("./custom-logger");
const logger = new lgg({
    level: 'info',
    common: [
        {"service": "chat"}
    ]
});

const AWS = require('aws-sdk');
// const csv = require('fast-csv');
// const fs = require('fs');
// AWS.config.loadFromPath('C:\\Users\\dario.brambilla\\Documents\\ws\\xesoft\\chat\\_root\\app\\aws-config.json');
AWS.config.update({region: 'eu-west-1', accessKeyId: process.env.COGNITO_ACCESS_KEY_ID, secretAccessKey: process.env.COGNITO_SECRET_ACCESS_KEY});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

class CognitoManager {

    constructor(userPoolID) {
        this.userPoolID = userPoolID;
    }

    createUser(nickname, email, profile, pass) {
        let userPoolID = this.userPoolID;

        // var tempPass = passGen.generate({
        //     length: 12,
        //     numbers: true,
        //     uppercase: true,
        //     excludeSimilarCharacters: true,
        //     symbols: true,
        //     strict: true,
        //     exclude: "\"'~°§/\\^£"
        // });

        var params = {
            UserPoolId: this.userPoolID,
            TemporaryPassword: pass,
            Username: email,
            UserAttributes: [
                {
                    "Name": "nickname",
                    "Value": nickname
                },
                {
                    "Name": "email",
                    "Value": email
                },
                {
                    "Name": "profile",
                    "Value": profile
                },
                {
                    "Name": "email_verified",
                    "Value": "True"
                }
            ]
        };

        logger.info("creating user with params: " + params);

        cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
            if (err)
                logger.error(`❌\t${email} - ${err.code} - ${err.message}`);
            else {
                logger.info(`✔\tThe user '${email}' has been created`);

                var params2 = {
                    Password: pass,
                    UserPoolId: userPoolID,
                    Username: email,
                    Permanent: true
                };

                cognitoidentityserviceprovider.adminSetUserPassword(params2, function (err, data) {
                    if (err)
                        console.log(err, err.stack); // an error occurred
                    else
                        console.log(`Password successuffly forced: ${email} - ${pass}`);           // successful response
                });

            }
        });
    }

    // deleteUser(row) {
    //     if (row.skip) {
    //         console.log(`⚠\tThe user '${row.username}' has been skipped`);
    //         return;
    //     }
    //
    //     if (row.email) {
    //         row.email = row.email.toLowerCase();
    //     }
    //
    //     if (row.username) {
    //         row.username = row.username.toLowerCase();
    //     }
    //
    //     var params = {
    //         UserPoolId: row.userPool,
    //         Username: row.username
    //     };
    //
    //     cognitoidentityserviceprovider.adminDeleteUser(params, function (err, data) {
    //         if (err) console.log(`❌\t${row.username} - ${err.code} - ${err.message}`); // an error occurred
    //         else console.log(`☠️\tThe user ${row.username} has been deleted`);
    //     });
    // }
}

module.exports = CognitoManager;

// var cognitoManager = new CognitoManager("eu-west-1_BOr6IaBxC");
// cognitoManager.createUser("test_nick", "ldlipanmeppmiilvoi@kiabws.com", "test_profile", "pippo2021:");