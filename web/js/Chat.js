'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { socket, jwtStr, roomID } from './socket.js';

var Chat = function (_React$Component) {
    _inherits(Chat, _React$Component);

    function Chat(props) {
        _classCallCheck(this, Chat);

        var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

        _this.state = {
            messages: []
        };
        return _this;
    }

    _createClass(Chat, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var temp_messages = this.state.messages;

            socket.on('history', function (data) {
                console.log("history: ");
                data.Items.forEach(function (element) {
                    console.log(element);
                    temp_messages.push({
                        "message": element.msg.S,
                        "nickname": element.senderNickname.S,
                        "date": new Date(element.creationDate.S).toLocaleString()
                    });
                });

                _this2.setState({
                    messages: temp_messages
                }, function () {
                    var chat_text_area = document.getElementById("message-room");
                    chat_text_area.scrollTop = chat_text_area.scrollHeight;
                });
            });

            socket.on('message', function (data) {
                console.log("message: " + data.message + " nickname: " + data.nickname);

                if (data.message != undefined && data.nickname != undefined) {
                    temp_messages.push({
                        "message": data.message,
                        "nickname": data.nickname,
                        "date": new Date(data.creationDate).toLocaleString()
                    });
                }

                _this2.setState({
                    messages: temp_messages
                }, function () {
                    var chat_text_area = document.getElementById("message-room");
                    chat_text_area.scrollTop = chat_text_area.scrollHeight;
                });
            });
        }
    }, {
        key: 'toggleChat',
        value: function toggleChat(event) {
            event.preventDefault();
            var chat_content = document.getElementById("chat-content");

            if (chat_content.classList.contains("hide")) {
                chat_content.classList.remove("hide");
            } else {
                chat_content.classList.add("hide");
            }
        }
    }, {
        key: 'sendMsg',
        value: function sendMsg(event) {
            event.preventDefault();
            var message = document.getElementById("message").value;
            console.log("clik submit msg: " + message);

            if (message.length > 0) {
                console.log("emitting roomID: " + roomID);
                socket.emit('room-manager', {
                    room: roomID,
                    message: message,
                    jwt: jwtStr,
                    msgType: "chat"
                });
                document.getElementById("message").value = "";
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { id: 'chat-content', className: 'hide' },
                    React.createElement(
                        'h4',
                        { className: 'chat-title' },
                        'CHAT GLOBALE ',
                        React.createElement(
                            'span',
                            { onClick: this.toggleChat, className: 'close' },
                            '\xD7'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'chat_text-wrapper' },
                        React.createElement(
                            'div',
                            { className: 'chat_text-area' },
                            React.createElement(
                                'div',
                                { id: 'message-room' },
                                this.state.messages.map(function (value, index) {
                                    return React.createElement(
                                        'div',
                                        { key: index, className: 'chat-msg-box' },
                                        React.createElement(
                                            'h4',
                                            { className: 'chat-nickname' },
                                            value.nickname,
                                            ' ',
                                            React.createElement(
                                                'span',
                                                { className: 'chat-date' },
                                                value.date
                                            )
                                        ),
                                        React.createElement(
                                            'p',
                                            null,
                                            value.message
                                        )
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'chat_send-msg-wrapper' },
                            React.createElement('input', { id: 'message', type: 'text', placeholder: 'Scrivi messaggio...' }),
                            React.createElement(
                                'div',
                                { className: 'button__send-msg', onClick: this.sendMsg },
                                React.createElement('img', { id: 'roomID', 'data-roomid': 'dating', src: '../img/send-msg.svg', alt: 'invia msg' })
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { id: 'chat-btn', onClick: this.toggleChat, className: 'chat_button-wrapper' },
                    React.createElement('img', { src: '../img/chat.png', alt: 'chat' })
                )
            );
        }
    }]);

    return Chat;
}(React.Component);

export default Chat;