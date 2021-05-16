'use strict';

import { get_username } from './cognitoclient.js';

class Registrazione extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      password:null
    };
  }

  componentDidMount() {
    this.setState({userName: get_username()});
    /*TO DO
      settare i valori delle statistiche, l'icona utente
    */


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

class FormGroupInputEmail extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (
            <div className="form__group__wrapper">
                <input type="email" id={this.props.id} name={this.props.id} required/>
                <label htmlFor={this.props.id} className="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

class FormGroupInputPwd extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (
            <div className="form__group__wrapper">
                <input type="password" id={this.props.id} name={this.props.id} minLength="8" required/>
                <label htmlFor={this.props.id} className="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

class LoginButton extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.registration.bind(this);
    }

    registration(event) {
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
                alert("authenticateUser onSuccess");
                console.log("authenticateUser onSuccess", result);
                loginOK(result);
                localStorage.setItem("xejwt", result.idToken.jwtToken);
                console.log("xejwt: "+localStorage.getItem("xejwt"));
                
                AmazonCognitoIdentity.CookieSto
                
                
                window.location = '/home.html';
            },

            onFailure: function (err) {
                alert("authenticateUser onFailure" + JSON.stringify(err));
                console.log("authenticateUser onFailure", err);
                loginKO(err);
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                var newPassword = prompt('Enter new password ', '');
                console.log("newPasswordRequired", userAttributes, requiredAttributes);
                cognitoUser.completeNewPasswordChallenge(newPassword, null, this)

            }
        });
		
    }

    render(){
        return (
            <div className="button__wrapper">
                <button onClick={this.registration} className="button__content">Accedi</button>
            </div>
        )
    }
}

export default Registrazione;