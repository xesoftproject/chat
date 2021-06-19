'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { FormGroupInputText, FormGroupInputEmail, FormGroupInputPwd } from './FormComponent.js';

var Registrazione = function (_React$Component) {
    _inherits(Registrazione, _React$Component);

    function Registrazione(props) {
        _classCallCheck(this, Registrazione);

        return _possibleConstructorReturn(this, (Registrazione.__proto__ || Object.getPrototypeOf(Registrazione)).call(this, props));
    }

    _createClass(Registrazione, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'form__group' },
                React.createElement(FormGroupInputText, { id: 'nicknameSignIn', label: 'Nickname' }),
                React.createElement(FormGroupInputEmail, { id: 'emailSignIn', label: 'Email' }),
                React.createElement(FormGroupInputPwd, { id: 'passwordSignIn', label: 'Password' }),
                React.createElement(SignInButton, null)
            );
        }
    }]);

    return Registrazione;
}(React.Component);

var SignInButton = function (_React$Component2) {
    _inherits(SignInButton, _React$Component2);

    function SignInButton(props) {
        _classCallCheck(this, SignInButton);

        var _this2 = _possibleConstructorReturn(this, (SignInButton.__proto__ || Object.getPrototypeOf(SignInButton)).call(this, props));

        _this2.onClick = _this2.signInButton.bind(_this2);
        return _this2;
    }

    _createClass(SignInButton, [{
        key: 'signInButton',
        value: function signInButton(event) {
            event.preventDefault();

            var formData = new FormData(event.target.form);

            var data = { 'email': formData.get("emailSignIn"), 'nickname': formData.get("nicknameSignIn"), 'pass': formData.get("passwordSignIn") };
            $.post('/user/signup', data, function (response) {
                if (response.includes("Error")) {
                    var modal_error = document.getElementById("error-modal");
                    modal_error.classList.remove("hide");
                    console.log("Errore nella registrazione: " + response);
                } else {
                    var registration_success_modal = document.getElementById("registration-success-modal");
                    registration_success_modal.classList.remove("hide");
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
                    'REGISTRATI'
                )
            );
        }
    }]);

    return SignInButton;
}(React.Component);

export default Registrazione;