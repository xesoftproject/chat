'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { get_username } from './cognitoclient.js';

var Registrazione = function (_React$Component) {
    _inherits(Registrazione, _React$Component);

    function Registrazione(props) {
        _classCallCheck(this, Registrazione);

        var _this = _possibleConstructorReturn(this, (Registrazione.__proto__ || Object.getPrototypeOf(Registrazione)).call(this, props));

        _this.state = {
            userId: null,
            password: null
        };
        return _this;
    }

    _createClass(Registrazione, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({ userName: get_username() });
            /*TO DO
              settare i valori delle statistiche, l'icona utente
            */
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'form__group' },
                React.createElement(FormGroupInputEmail, { id: 'emailSignIn', label: 'Email' }),
                React.createElement(FormGroupInputPwd, { id: 'passwordSignIn', label: 'Password' }),
                React.createElement(LoginButton, null)
            );
        }
    }]);

    return Registrazione;
}(React.Component);

var FormGroupInputEmail = function (_React$Component2) {
    _inherits(FormGroupInputEmail, _React$Component2);

    function FormGroupInputEmail(props) {
        _classCallCheck(this, FormGroupInputEmail);

        return _possibleConstructorReturn(this, (FormGroupInputEmail.__proto__ || Object.getPrototypeOf(FormGroupInputEmail)).call(this, props));
    }

    _createClass(FormGroupInputEmail, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'form__group__wrapper' },
                React.createElement('input', { type: 'email', id: this.props.id, name: this.props.id, required: true }),
                React.createElement(
                    'label',
                    { htmlFor: this.props.id, className: 'form-group__label' },
                    this.props.label
                )
            );
        }
    }]);

    return FormGroupInputEmail;
}(React.Component);

var FormGroupInputPwd = function (_React$Component3) {
    _inherits(FormGroupInputPwd, _React$Component3);

    function FormGroupInputPwd(props) {
        _classCallCheck(this, FormGroupInputPwd);

        return _possibleConstructorReturn(this, (FormGroupInputPwd.__proto__ || Object.getPrototypeOf(FormGroupInputPwd)).call(this, props));
    }

    _createClass(FormGroupInputPwd, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'form__group__wrapper' },
                React.createElement('input', { type: 'password', id: this.props.id, name: this.props.id, minLength: '8', required: true }),
                React.createElement(
                    'label',
                    { htmlFor: this.props.id, className: 'form-group__label' },
                    this.props.label
                )
            );
        }
    }]);

    return FormGroupInputPwd;
}(React.Component);

var LoginButton = function (_React$Component4) {
    _inherits(LoginButton, _React$Component4);

    function LoginButton(props) {
        _classCallCheck(this, LoginButton);

        var _this4 = _possibleConstructorReturn(this, (LoginButton.__proto__ || Object.getPrototypeOf(LoginButton)).call(this, props));

        _this4.onClick = _this4.registration.bind(_this4);
        return _this4;
    }

    _createClass(LoginButton, [{
        key: 'registration',
        value: function registration(event) {
            event.preventDefault();

            var formData = new FormData(event.target.form);

            var authenticationData = {
                Username: formData.get("emailSignIn"),
                Password: formData.get("passwordSignIn")
            };

            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

            var poolData = {
                UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
                ClientId: "6vligtquo88fguj7e5dsr6mlmj" // Your client id here
            };

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

            console.log('userpool: ' + JSON.stringify(userPool));

            var userData = {
                Username: formData.get("emailSignIn"),
                Pool: userPool,
                Storage: new AmazonCognitoIdentity.CookieStorage({ domain: location.hostname })
            };

            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function onSuccess(result) {
                    alert("authenticateUser onSuccess");
                    console.log("authenticateUser onSuccess", result);
                    loginOK(result);
                    localStorage.setItem("xejwt", result.idToken.jwtToken);
                    console.log("xejwt: " + localStorage.getItem("xejwt"));

                    AmazonCognitoIdentity.CookieSto;

                    window.location = '/home.html';
                },

                onFailure: function onFailure(err) {
                    alert("authenticateUser onFailure" + JSON.stringify(err));
                    console.log("authenticateUser onFailure", err);
                    loginKO(err);
                },

                newPasswordRequired: function newPasswordRequired(userAttributes, requiredAttributes) {
                    var newPassword = prompt('Enter new password ', '');
                    console.log("newPasswordRequired", userAttributes, requiredAttributes);
                    cognitoUser.completeNewPasswordChallenge(newPassword, null, this);
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'button__wrapper' },
                React.createElement(
                    'button',
                    { onClick: this.registration, className: 'button__content' },
                    'Accedi'
                )
            );
        }
    }]);

    return LoginButton;
}(React.Component);

export default Registrazione;