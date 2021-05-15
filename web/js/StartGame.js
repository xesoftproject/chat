'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var colorOptions = [{ value: 'white', label: 'Bianco' }, { value: 'black', label: 'Nero' }];

var opponentOptions = [{ value: 'cpu', label: 'CPU' }, { value: 'friend', label: 'Amico' }];

var StartGame = function (_React$Component) {
    _inherits(StartGame, _React$Component);

    function StartGame(props) {
        _classCallCheck(this, StartGame);

        var _this = _possibleConstructorReturn(this, (StartGame.__proto__ || Object.getPrototypeOf(StartGame)).call(this, props));

        _this.state = { date: new Date() };
        return _this;
    }

    _createClass(StartGame, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'form__group' },
                React.createElement(FormGroupElements, { name: 'color', id: 'colori', options: colorOptions, label: 'Colore', htmlFor: 'colors' }),
                React.createElement(FormGroupElements, { name: 'opponent', id: 'opponent', options: opponentOptions, label: 'Sfidante', htmlFor: 'opponent' })
            );
        }
    }]);

    return StartGame;
}(React.Component);

var FormGroupElements = function (_React$Component2) {
    _inherits(FormGroupElements, _React$Component2);

    function FormGroupElements() {
        _classCallCheck(this, FormGroupElements);

        return _possibleConstructorReturn(this, (FormGroupElements.__proto__ || Object.getPrototypeOf(FormGroupElements)).apply(this, arguments));
    }

    _createClass(FormGroupElements, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'form__group__wrapper' },
                React.createElement(Select, { name: this.props.name, id: this.props.id, options: this.props.options }),
                React.createElement(
                    'label',
                    { htmlFor: this.props.htmlFor, className: 'form-group__label' },
                    this.props.label
                )
            );
        }
    }]);

    return FormGroupElements;
}(React.Component);

var Select = function (_React$Component3) {
    _inherits(Select, _React$Component3);

    function Select() {
        _classCallCheck(this, Select);

        var _this3 = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this));

        _this3.onChange = _this3.onChange.bind(_this3);
        return _this3;
    }

    _createClass(Select, [{
        key: 'onChange',
        value: function onChange(event) {
            console.log(event.target.value);
        }
    }, {
        key: 'render',
        value: function render() {
            var options = this.props.options;
            return React.createElement(
                'select',
                { id: this.props.id, name: this.props.name, onChange: this.onChange },
                options.map(function (item, index) {
                    return React.createElement(
                        'option',
                        { value: item.value, key: index },
                        item.label
                    );
                })
            );
        }
    }]);

    return Select;
}(React.Component);

export default StartGame;