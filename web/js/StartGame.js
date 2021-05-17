'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';
import { get_username } from './cognitoclient.js';

import { FormGroupSelect } from './FormComponent.js';

var socket = io(document.location.origin + '/xesoft_chat');
var room = "chat";
var jwt = localStorage.getItem("xejwt");

var StartGame = function (_React$Component) {
    _inherits(StartGame, _React$Component);

    function StartGame(props) {
        _classCallCheck(this, StartGame);

        var _this = _possibleConstructorReturn(this, (StartGame.__proto__ || Object.getPrototypeOf(StartGame)).call(this, props));

        _this.handleCallback = function (childData) {
            _this.setState({
                dataFromChild: childData
            });
        };

        _this.state = {
            friendsOptions: [],
            dataFromChild: null,
            userId: null
        };
        _this.handleCallback = _this.handleCallback.bind(_this);
        return _this;
    }

    _createClass(StartGame, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({
                friendsOptions: this.getFriendsOptions(),
                userId: get_username()
            });
        }
    }, {
        key: 'getFriendsOptions',
        value: function getFriendsOptions() {
            var options = [];

            socket.emit('room-users-list', {
                room: room,
                jwt: jwt,
                msgType: "command"
            });

            socket.on('room-users-list', function (message) {
                message.users.forEach(function (items) {
                    if (options.indexOf(items) === -1) {
                        options.push({ value: items, label: items });
                    }
                });
            });

            return options;
        }
    }, {
        key: 'render',
        value: function render() {
            var colorOptions = [{ value: 'white', label: 'Bianco' }, { value: 'black', label: 'Nero' }];
            var opponentOptions = [{ value: 'cpu', label: 'CPU' }, { value: 'friend', label: 'Amico' }];

            return React.createElement(
                'div',
                { className: 'form__group' },
                React.createElement(FormGroupSelect, { data: 'color', options: colorOptions, label: 'Colore', needCallback: 'false', className: '' }),
                React.createElement(FormGroupSelect, { data: 'opponent', options: opponentOptions, label: 'Sfidante', className: '',
                    needCallback: 'true', parentCallback: this.handleCallback, checkValue: 'friend' }),
                React.createElement(FormGroupSelect, { className: this.state.dataFromChild ? "visibility-visible" : "visibility-hidden", data: 'friend',
                    options: this.state.friendsOptions, label: 'Amici', needCallback: 'false' }),
                React.createElement(StartGameButton, { userId: this.state.userId })
            );
        }
    }]);

    return StartGame;
}(React.Component);

var StartGameButton = function (_React$Component2) {
    _inherits(StartGameButton, _React$Component2);

    function StartGameButton(props) {
        _classCallCheck(this, StartGameButton);

        var _this2 = _possibleConstructorReturn(this, (StartGameButton.__proto__ || Object.getPrototypeOf(StartGameButton)).call(this, props));

        _this2.onClick = _this2.onClick.bind(_this2);
        return _this2;
    }

    _createClass(StartGameButton, [{
        key: 'onClick',
        value: function onClick(event) {
            event.preventDefault();

            var formData = new FormData(event.target.form);
            console.log(formData.get("color"));

            var color = formData.get("color");
            var opponent = formData.get("opponent");
            var friend = formData.get("friend");
            console.log('[color: %o, opponent: %o, friend: %o]', color, opponent, friend);

            var white = color === 'white' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
            var black = color === 'black' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
            console.log('[white: %o, black: %o]', white, black);

            start_new_game(this.props.userId, white, black).then(function (game_id) {
                console.log('[game_id: %o]', game_id);
                window.location.assign(PATH_GAME + '?' + QUERY_PARAMS_GAME_ID + '=' + game_id);
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
                    { onClick: this.onClick, type: 'submit', className: 'button__content' },
                    'Inizia partita'
                )
            );
        }
    }]);

    return StartGameButton;
}(React.Component);

export default StartGame;