'use strict';

import {FormGroupInputEmail,FormGroupInputPwd} from './FormComponent.js';
import {COGNITO_USER_POOL} from './cognitoclient.js';

const modal_error = document.getElementById("error-modal");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      password:null
    };
  }

  componentDidMount() {
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
                localStorage.setItem("xejwt", result.idToken.jwtToken);               
                AmazonCognitoIdentity.CookieSto
                window.location = '/';
            },

            onFailure: function (err) {
                modal_error.classList.remove("hide");
                console.log("authenticateUser onFailure" + JSON.stringify(err));
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