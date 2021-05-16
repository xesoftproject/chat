'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { FormGroupInputEmail, FormGroupInputPwd } from './FormComponent.js';

var Login = function (_React$Component) {
    _inherits(Login, _React$Component);

    function Login(props) {
        _classCallCheck(this, Login);

        var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

        _this.state = {
            userId: null,
            password: null
        };
        return _this;
    }

    _createClass(Login, [{
        key: 'componentDidMount',
        value: function componentDidMount() {

            /*TO DO
              settare i valori delle statistiche, l'icona utente
            */

            var poolData = {
                UserPoolId: "eu-west-1_BOr6IaBxC", // Your user pool id here
                ClientId: "6vligtquo88fguj7e5dsr6mlmj", // Your client id here
                Storage: new AmazonCognitoIdentity.CookieStorage({ domain: location.hostname })
            };

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser == null) {
                console.log("user not found");
            } else {
                cognitoUser.getSession(function (err, session) {
                    loginOK(session);
                });
            }
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

    return Login;
}(React.Component);

var LoginButton = function (_React$Component2) {
    _inherits(LoginButton, _React$Component2);

    function LoginButton(props) {
        _classCallCheck(this, LoginButton);

        var _this2 = _possibleConstructorReturn(this, (LoginButton.__proto__ || Object.getPrototypeOf(LoginButton)).call(this, props));

        _this2.onClick = _this2.signInButton.bind(_this2);
        return _this2;
    }

    _createClass(LoginButton, [{
        key: 'signInButton',
        value: function signInButton(event) {
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
                    /*alert("authenticateUser onSuccess");
                    console.log("authenticateUser onSuccess", result);
                    loginOK(result);*/
                    localStorage.setItem("xejwt", result.idToken.jwtToken);
                    /*console.log("xejwt: "+localStorage.getItem("xejwt"));*/

                    AmazonCognitoIdentity.CookieSto;

                    window.location = '/home.html';
                },

                onFailure: function onFailure(err) {
                    alert("authenticateUser onFailure" + JSON.stringify(err));
                    /*console.log("authenticateUser onFailure", err);
                    loginKO(err);*/
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
                    { onClick: this.signInButton, className: 'button__content' },
                    'Accedi'
                )
            );
        }
    }]);

    return LoginButton;
}(React.Component);

export default Login;