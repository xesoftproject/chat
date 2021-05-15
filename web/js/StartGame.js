'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StartGame = function (_React$Component) {
    _inherits(StartGame, _React$Component);

    function StartGame(props) {
        _classCallCheck(this, StartGame);

        var _this = _possibleConstructorReturn(this, (StartGame.__proto__ || Object.getPrototypeOf(StartGame)).call(this, props));

        _this.handleCallback = function (childData) {
            _this.setState({ dataFromChild: childData });
        };

        _this.state = {
            friendsOptions: [],
            dataFromChild: null
        };
        return _this;
    }

    _createClass(StartGame, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.setState({ friendsOptions: this.getFriendsOptions() });
        }
    }, {
        key: "getFriendsOptions",
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
        key: "render",
        value: function render() {
            var colorOptions = [{ value: 'white', label: 'Bianco' }, { value: 'black', label: 'Nero' }];
            var opponentOptions = [{ value: 'cpu', label: 'CPU' }, { value: 'friend', label: 'Amico' }];

            console.log(this.state.dataFromChild);

            var friendSelect = void 0;

            if (this.state.dataFromChild) {
                friendSelect = React.createElement(FormGroupSelect, { data: "friend", options: this.state.friendsOptions, label: "Amici", needCallback: "false" });
            }

            return React.createElement(
                "div",
                { className: "form__group" },
                React.createElement(FormGroupSelect, { data: "color", options: colorOptions, label: "Colore", needCallback: "false" }),
                React.createElement(FormGroupSelect, { data: "opponent", options: opponentOptions, label: "Sfidante", needCallback: "true", parentCallback: this.handleCallback, checkValue: "friend" }),
                friendSelect
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
        key: "onChange",
        value: function onChange(event, needCallback, checkValue) {
            console.log(needCallback);
            if (needCallback) {
                if (event.target.value === checkValue) {
                    this.props.parentCallback(true);
                } else {
                    this.props.parentCallback(false);
                }
            }

            event.preventDefault();
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var options = this.props.options;
            var needCallback = this.props.needCallback;
            var checkValue = this.props.checkValue;

            return React.createElement(
                "div",
                { className: "form__group__wrapper" },
                React.createElement(
                    "select",
                    { id: this.props.data, name: this.props.data, onChange: function onChange(event) {
                            return _this3.onChange(event, needCallback, checkValue);
                        } },
                    options.map(function (item, index) {
                        return React.createElement(
                            "option",
                            { value: item.value, key: index },
                            item.label
                        );
                    })
                ),
                React.createElement(
                    "label",
                    { htmlFor: this.props.data, className: "form-group__label" },
                    this.props.label
                )
            );
        }
    }]);

    return FormGroupSelect;
}(React.Component);

export default StartGame;