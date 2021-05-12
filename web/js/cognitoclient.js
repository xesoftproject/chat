const COGNITO_USER_POOL = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
	ClientId: "6vligtquo88fguj7e5dsr6mlmj", // Your client id here
	Storage: new AmazonCognitoIdentity.CookieStorage({ domain: location.hostname })
});

const get_username = () => {
	//return COGNITO_USER_POOL.getCurrentUser().username;
	return "piero"
};

export { get_username };
