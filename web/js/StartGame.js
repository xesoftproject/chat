'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';
import { get_username } from './cognitoclient.js';

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
            /*TO DO LISTA AMICI*/
            var friends = ["giovanni", "mario"];
            var options = [];
            friends.forEach(function (items) {
                options.push({ value: items, label: items });
            });
            return options;
        }
    }, {
        key: 'render',
        value: function render() {
            var colorOptions = [{ value: 'white', label: 'Bianco' }, { value: 'black', label: 'Nero' }];
            var opponentOptions = [{ value: 'cpu', label: 'CPU' }, { value: 'friend', label: 'Amico' }];

            var friendSelect = void 0;

            if (this.state.dataFromChild) {
                friendSelect = React.createElement(FormGroupSelect, { data: 'friend', options: this.state.friendsOptions, label: 'Amici', needCallback: 'false' });
            }

            return React.createElement(
                'div',
                { className: 'form__group' },
                React.createElement(FormGroupSelect, { data: 'color', options: colorOptions, label: 'Colore', needCallback: 'false' }),
                React.createElement(FormGroupSelect, { data: 'opponent', options: opponentOptions, label: 'Sfidante', needCallback: 'true', parentCallback: this.handleCallback, checkValue: 'friend' }),
                friendSelect,
                React.createElement(StartGameButton, { userId: this.state.userId })
            );
        }
    }]);

    return StartGame;
}(React.Component);

var FormGroupSelect = function (_React$Component2) {
    _inherits(FormGroupSelect, _React$Component2);

    function FormGroupSelect() {
        _classCallCheck(this, FormGroupSelect);

        var _this2 = _possibleConstructorReturn(this, (FormGroupSelect.__proto__ || Object.getPrototypeOf(FormGroupSelect)).call(this));

        _this2.onChange = _this2.onChange.bind(_this2);
        return _this2;
    }

    _createClass(FormGroupSelect, [{
        key: 'onChange',
        value: function onChange(event, needCallback, checkValue) {
            console.log(needCallback);
            if (!needCallback) {
                if (event.target.value === checkValue) {
                    this.props.parentCallback(true);
                } else {
                    this.props.parentCallback(false);
                }
            }

            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var options = this.props.options;
            var needCallback = this.props.needCallback;
            var checkValue = this.props.checkValue;

            return React.createElement(
                'div',
                { className: 'form__group__wrapper' },
                React.createElement(
                    'select',
                    { id: this.props.data, name: this.props.data, onChange: function onChange(event) {
                            return _this3.onChange(event, needCallback, checkValue);
                        } },
                    options.map(function (item, index) {
                        return React.createElement(
                            'option',
                            { value: item.value, key: index },
                            item.label
                        );
                    })
                ),
                React.createElement(
                    'label',
                    { htmlFor: this.props.data, className: 'form-group__label' },
                    this.props.label
                )
            );
        }
    }]);

    return FormGroupSelect;
}(React.Component);

var StartGameButton = function (_React$Component3) {
    _inherits(StartGameButton, _React$Component3);

    function StartGameButton(props) {
        _classCallCheck(this, StartGameButton);

        var _this4 = _possibleConstructorReturn(this, (StartGameButton.__proto__ || Object.getPrototypeOf(StartGameButton)).call(this, props));

        _this4.onClick = _this4.onClick.bind(_this4);
        return _this4;
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

            var game_id = start_new_game(this.props.userId, white, black).then(function () {
                console.log('[game_id: %o]', game_id);

                //window.location.assign(`${PATH_GAME}?${QUERY_PARAMS_GAME_ID}=${game_id}`);
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