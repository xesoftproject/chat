'use strict';

const {config, CognitoIdentityServiceProvider} = require('aws-sdk');
const {CONFIG} = require('./configurations/configurations');

config.update({
    region: 'eu-west-1',
    accessKeyId: process.env.COGNITO_ACCESS_KEY_ID || CONFIG.COGNITO_ACCESS_KEY_ID,
    secretAccessKey: process.env.COGNITO_SECRET_ACCESS_KEY || CONFIG.COGNITO_SECRET_ACCESS_KEY
});

class CognitoManager {
    constructor(userPoolID) {
        this.userPoolID = userPoolID;
        this.provider = new CognitoIdentityServiceProvider();
    }

    async createUser(nickname, email, profile, pass) {
        var params = {
            UserPoolId: this.userPoolID,
            TemporaryPassword: pass,
            Username: email,
            UserAttributes: [
                {
                    Name: 'nickname',
                    Value: nickname
                },
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'profile',
                    Value: profile
                },
                {
                    Name: 'email_verified',
                    Value: 'True'
                }
            ]
        };

        console.log('creating user with params: %o', params);
        // try {
        //     this.provider.adminCreateUser(params).promise();
        //     console.log('✔\tThe user %o has been created', email);
        //
        //     var params2 = {
        //         Password: pass,
        //         UserPoolId: this.userPoolID,
        //         Username: email,
        //         Permanent: true
        //     };
        //
        //     this.provider.adminSetUserPassword(params2, (err) => {
        //         if (err) {
        //             console.log(err, err.stack);
        //             throw err;
        //         }
        //
        //         console.log('Password successuffly forced: %o - %o', email, pass);
        //     });
        // } catch (err) {
        //     console.error('❌\t%o - %o - %o', email, err.code, err.message);
        //     throw err;
        // }
        // try {
        const ress = await this.provider.adminCreateUser(params).promise().catch(err => {
            //handle error
            throw err //break the chain!
        });
        // console.log(ress);
        // } catch (err) {
        //     console.log(err);
        //     throw err;
        // }


        // this.provider.adminCreateUser(params, (err) => {
        //     throw "trest";
        //     if (err != null) {
        //         console.error('❌\t%o - %o - %o', email, err.code, err.message);
        //         throw err;
        //     }
        console.log('✔\tThe user %o has been created', email);

        var params2 = {
            Password: pass,
            UserPoolId: this.userPoolID,
            Username: email,
            Permanent: true
        };

        this.provider.adminSetUserPassword(params2, (err) => {
            if (err) {
                console.log(err, err.stack);
                throw err;
            }

            console.log('Password successuffly forced: %o - %o', email, pass);
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
    //     provider.adminDeleteUser(params, function (err, data) {
    //         if (err) console.log(`❌\t${row.username} - ${err.code} - ${err.message}`); // an error occurred
    //         else console.log(`☠️\tThe user ${row.username} has been deleted`);
    //     });
    // }
}

module.exports = {CognitoManager};
