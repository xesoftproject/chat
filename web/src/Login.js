'use strict';

import {FormGroupInputEmail,FormGroupInputPwd} from './FormComponent.js';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      password:null
    };
  }

  componentDidMount() {
    
    /*TO DO
      settare i valori delle statistiche, l'icona utente
    */


      var poolData = {
        UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
        ClientId: "6vligtquo88fguj7e5dsr6mlmj", // Your client id here
        Storage: new AmazonCognitoIdentity.CookieStorage({domain: location.hostname})
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser == null) {
        console.log("user not found");
        
    }else{
        cognitoUser.getSession(function (err, session) {
            loginOK(session);
        });
    }
  }

  render() {
    return (
        <div className="form__group">
            <FormGroupInputEmail id="emailSignIn" label="Email"/>
            <FormGroupInputPwd id="passwordSignIn" label="Password"/>
            <LoginButton />
        </div>
    )
  }
}

class LoginButton extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.signInButton.bind(this);
    }

    signInButton(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target.form);

        var authenticationData = {
            Username: formData.get("emailSignIn"),
            Password: formData.get("passwordSignIn")
        };

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        var poolData = {
            UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
            ClientId: "6vligtquo88fguj7e5dsr6mlmj", // Your client id here
        };

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        console.log('userpool: ' + JSON.stringify(userPool))

        var userData = {
            Username: formData.get("emailSignIn"),
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
                
                
                window.location = '/home.html';
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
                <button onClick={this.signInButton} className="button__content">Accedi</button>
            </div>
        )
    }
}

export default Login;