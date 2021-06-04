'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { socket } from './socket.js';

var socketId = socket;
var modal = document.getElementById("invitation-modal");

var InvitationModal = function (_React$Component) {
    _inherits(InvitationModal, _React$Component);

    function InvitationModal(props) {
        _classCallCheck(this, InvitationModal);

        var _this = _possibleConstructorReturn(this, (InvitationModal.__proto__ || Object.getPrototypeOf(InvitationModal)).call(this, props));

        _this.state = {
            friendGameLink: null,
            friendInvitationGame: null
        };
        return _this;
    }

    _createClass(InvitationModal, [{
        key: 'onClick',
        value: function onClick(event) {
            event.preventDefault();
            modal.classList.add("hide");
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            socketId.on('invitation', function (data) {
                console.log('on message vito %o', data);

                _this2.setState({
                    friendGameLink: data.link,
                    friendInvitationGame: data.from
                });
                modal.classList.remove("hide");
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'modal-wrapper' },
                React.createElement(
                    'span',
                    { onClick: this.onClick, className: 'close' },
                    '\xD7'
                ),
                React.createElement(
                    'p',
                    null,
                    this.state.friendInvitationGame,
                    ' ti ha invitato a giocare!'
                ),
                React.createElement(
                    'div',
                    { className: 'button__wrapper' },
                    React.createElement(
                        'a',
                        { href: this.state.friendGameLink, className: 'button__content' },
                        'Inizia partita'
                    )
                )
            );
        }
    }]);

    return InvitationModal;
}(React.Component);

export default InvitationModal;