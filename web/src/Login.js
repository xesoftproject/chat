'use strict';

import { get_username } from './cognitoclient.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
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
            <div class="form__group__wrapper">
                <input type="email" id={this.props.id} name={this.props.id} required/>
                <label for={this.props.id} class="form-group__label">{this.props.label}</label>
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
            <div class="form__group__wrapper">
                <input type="password" id={this.props.id} name={this.props.id} minlength="8" required/>
                <label for={this.props.id} class="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

export default Login;