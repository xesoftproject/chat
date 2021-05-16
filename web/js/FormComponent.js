var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormGroupSelect = function (_React$Component) {
    _inherits(FormGroupSelect, _React$Component);

    function FormGroupSelect() {
        _classCallCheck(this, FormGroupSelect);

        var _this = _possibleConstructorReturn(this, (FormGroupSelect.__proto__ || Object.getPrototypeOf(FormGroupSelect)).call(this));

        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    _createClass(FormGroupSelect, [{
        key: "onChange",
        value: function onChange(event, needCallback, checkValue) {
            console.log(needCallback);
            needCallback = needCallback == 'true';
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
            var _this2 = this;

            var options = this.props.options;
            var needCallback = this.props.needCallback;
            var checkValue = this.props.checkValue;

            return React.createElement(
                "div",
                { className: "form__group__wrapper " + this.props.className },
                React.createElement(
                    "select",
                    { id: this.props.data, name: this.props.data, onChange: function onChange(event) {
                            return _this2.onChange(event, needCallback, checkValue);
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

var FormGroupInputEmail = function (_React$Component2) {
    _inherits(FormGroupInputEmail, _React$Component2);

    function FormGroupInputEmail(props) {
        _classCallCheck(this, FormGroupInputEmail);

        var _this3 = _possibleConstructorReturn(this, (FormGroupInputEmail.__proto__ || Object.getPrototypeOf(FormGroupInputEmail)).call(this, props));

        _this3.state = {
            value: "dario.brambilla@finconsgroup.com"
        };
        _this3.handleChange = _this3.handleChange.bind(_this3);
        return _this3;
    }

    _createClass(FormGroupInputEmail, [{
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ value: event.target.value });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "form__group__wrapper" },
                React.createElement("input", { type: "email", id: this.props.id, name: this.props.id, value: this.state.value, onChange: this.handleChange, required: true }),
                React.createElement(
                    "label",
                    { htmlFor: this.props.id, className: "form-group__label" },
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

        var _this4 = _possibleConstructorReturn(this, (FormGroupInputPwd.__proto__ || Object.getPrototypeOf(FormGroupInputPwd)).call(this, props));

        _this4.state = {
            value: "a7S+R%!(eawX"
        };
        _this4.handleChange = _this4.handleChange.bind(_this4);
        return _this4;
    }

    _createClass(FormGroupInputPwd, [{
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ value: event.target.value });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "form__group__wrapper" },
                React.createElement("input", { type: "password", id: this.props.id, name: this.props.id, minLength: "8", value: this.state.value, onChange: this.handleChange, required: true }),
                React.createElement(
                    "label",
                    { htmlFor: this.props.id, className: "form-group__label" },
                    this.props.label
                )
            );
        }
    }]);

    return FormGroupInputPwd;
}(React.Component);

export { FormGroupSelect, FormGroupInputEmail, FormGroupInputPwd };