'use strict';

import {FormGroupInputText,FormGroupInputEmail,FormGroupInputPwd} from './FormComponent.js';

class Registrazione extends React.Component {
  constructor(props) {
    super(props);
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
            if(response.includes("Error")){
                const modal_error = document.getElementById("error-modal");
                modal_error.classList.remove("hide");
                console.log("Errore nella registrazione: "+response)
            }else{
                const registration_success_modal = document.getElementById("registration-success-modal");
                
                document.getElementById("registrazione").checked = false;
                document.getElementById("login").checked = true;
                
                registration_success_modal.classList.remove("hide");
            }
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