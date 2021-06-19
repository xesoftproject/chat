'use strict';

import {FormGroupInputText,FormGroupInputEmail,FormGroupInputPwd} from './FormComponent.js';

const modal_error = document.getElementById("error-modal");

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
            alert(response);
            if(response.includes("Error")){
                modal_error.classList.remove("hide");
                console.log("Errore nella registrazione: "+response)
            }else{
                window.location = '/';
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