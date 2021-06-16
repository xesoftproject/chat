'use strict';

import {FormGroupInputText,FormGroupInputEmail,FormGroupInputPwd} from './FormComponent.js';

class Registrazione extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("Nome Utente: test_01")
    console.log("Email Utente: ldlipanmeppmiilvoi@kiabws.com")
    console.log("Password Utente: pippo2021:")
  }

  render() {
    return (
        <div className="form__group">
            <FormGroupInputText id="nicknameSignIn" label="Nickname"/>
            <FormGroupInputEmail id="emailSignIn" label="Email"/>
            <FormGroupInputPwd id="passwordSignIn" label="Password"/>
            <SignInButton />
        </div>
    )
  }
}

class SignInButton extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.signInButton.bind(this);
    }

    signInButton(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target.form);

        const data = {'email':formData.get("emailSignIn"),'nickname':formData.get("nicknameSignIn"), 'pass': formData.get("passwordSignIn")}
        $.post('/user/signup', data, function(response) {
            alert(response);
            window.location = '/';
        });
		
    }

    render(){
        return (
            <div className="button__wrapper">
                <button onClick={this.signInButton} className="button__content">REGISTRATI</button>
            </div>
        )
    }
}

export default Registrazione;