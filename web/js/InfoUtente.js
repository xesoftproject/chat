'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { get_username } from './cognitoclient.js';

var InfoUtente = function (_React$Component) {
  _inherits(InfoUtente, _React$Component);

  function InfoUtente() {
    _classCallCheck(this, InfoUtente);

    return _possibleConstructorReturn(this, (InfoUtente.__proto__ || Object.getPrototypeOf(InfoUtente)).apply(this, arguments));
  }

  _createClass(InfoUtente, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(UseraName, null),
        React.createElement(
          'div',
          { className: 'grid-container grid-container__nested' },
          React.createElement(
            'div',
            { className: 'hidden-xs hidden-sm grid-cl-2-desktop' },
            React.createElement(
              'div',
              null,
              React.createElement('img', { src: '', alt: 'user-icon' })
            )
          ),
          React.createElement(
            'div',
            { className: 'grid-cl-2-mobile grid-cl-6-tablet grid-cl-7-desktop' },
            React.createElement(
              'div',
              { className: 'statistiche' },
              React.createElement(
                'p',
                null,
                'Vittorie: 0'
              ),
              React.createElement(
                'p',
                null,
                'Sconfitte: 0'
              ),
              React.createElement(
                'p',
                null,
                'Pareggi: 0'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'grid-cl-2-mobile grid-cl-6-tablet grid-cl-3-desktop statistiche__container-link' },
            React.createElement(
              'a',
              { href: '#' },
              'Storico partite'
            )
          )
        )
      );
    }
  }]);

  return InfoUtente;
}(React.Component);

var UseraName = function (_React$Component2) {
  _inherits(UseraName, _React$Component2);

  function UseraName(props) {
    _classCallCheck(this, UseraName);

    var _this2 = _possibleConstructorReturn(this, (UseraName.__proto__ || Object.getPrototypeOf(UseraName)).call(this, props));

    _this2.state = { name: null };
    return _this2;
  }

  _createClass(UseraName, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({ name: get_username() });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'h2',
        { className: 'title' },
        this.state.name
      );
    }
  }]);

  return UseraName;
}(React.Component);

export default InfoUtente;