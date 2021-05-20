'use strict';

const {config, CognitoIdentityServiceProvider} = require('aws-sdk');

config.update({
	region: 'eu-west-1',
	accessKeyId: process.env.COGNITO_ACCESS_KEY_ID,
	secretAccessKey: process.env.COGNITO_SECRET_ACCESS_KEY
});

class CognitoManager {
	constructor(userPoolID) {
		this.userPoolID = userPoolID;
		this.provider = new CognitoIdentityServiceProvider();
	}

	createUser(nickname, email, profile, pass) {
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

		this.provider.adminCreateUser(params, (err) => {
			if (err!=null) {
				console.error('❌\t%o - %o - %o', email, err.code, err.message);
				return;
			}
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
					return;
				}

				console.log('Password successuffly forced: %o - %o', email, pass);
			});
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
