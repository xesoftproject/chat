'use strict';

import {FormGroupInputEmail,FormGroupInputPwd} from './FormComponent.js';
import {COGNITO_USER_POOL} from './cognitoclient.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      password:null
    };
  }

  componentDidMount() {
    
    console.log("Nome Utente: dario.brambilla@finconsgroup.com")
    console.log("Password Utente: a7S+R%!(eawX")

    /*var poolData = {
        UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
        ClientId: "6vligtquo88fguj7e5dsr6mlmj", // Your client id here
        Storage: new AmazonCognitoIdentity.CookieStorage({domain: location.hostname})
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser == null) {*/
    if (COGNITO_USER_POOL.getCurrentUser() == null) {
        console.log("user not found");
        
    }/*else{
        cognitoUser.getSession(function (err, session) {
            loginOK(session);
        });
    }*/
  }

  render() {
    return (
        <div className="form__group">
            <FormGroupInputEmail id="emailLogIn" label="Email"/>
            <FormGroupInputPwd id="passwordLogIn" label="Password"/>
            <LoginButton />
        </div>
    )
  }
}

class LoginButton extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.logInButton.bind(this);
    }

    logInButton(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target.form);

        var authenticationData = {
            Username: formData.get("emailLogIn"),
            Password: formData.get("passwordLogIn")
        };

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        var poolData = {
            UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
            ClientId: "6vligtquo88fguj7e5dsr6mlmj", // Your client id here
        };

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        console.log('userpool: ' + JSON.stringify(userPool))

        var userData = {
            Username: formData.get("emailLogIn"),
            Pool: userPool,
            Storage: new AmazonCognitoIdentity.CookieStorage({domain: location.hostname})
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                /*alert("authenticateUser onSuccess");
                console.log("authenticateUser onSuccess", result);
                loginOK(result);*/
                localStorage.setItem("xejwt", result.idToken.jwtToken);
                /*console.log("xejwt: "+localStorage.getItem("xejwt"));*/
                
                AmazonCognitoIdentity.CookieSto
                
                
                window.location = '/';
            },

            onFailure: function (err) {
                alert("authenticateUser onFailure" + JSON.stringify(err));
                /*console.log("authenticateUser onFailure", err);
                loginKO(err);*/
            },
        });
		
    }

    render(){
        return (
            <div className="button__wrapper">
                <button onClick={this.logInButton} className="button__content">Accedi</button>
            </div>
        )
    }
}

export default Login;