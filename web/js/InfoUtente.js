'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { get_username } from './cognitoclient.js';
import { player_games_history } from '../js/moves-rest-client.js';

var url_link = "#";
var label_link = "Guida al gioco";

var InfoUtente = function (_React$Component) {
  _inherits(InfoUtente, _React$Component);

  function InfoUtente(props) {
    _classCallCheck(this, InfoUtente);

    var _this = _possibleConstructorReturn(this, (InfoUtente.__proto__ || Object.getPrototypeOf(InfoUtente)).call(this, props));

    _this.state = {
      userName: null,
      userIcon: "../img/avatar.png",
      statistiche: {
        victories: 0,
        defeats: 0,
        draws: 0
      }
    };
    return _this;
  }

  _createClass(InfoUtente, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.setState({ userName: get_username() });
      /*TO DO settare l'icona utente*/
      player_games_history(get_username()).then(function (statistiche) {
        _this2.setState({ statistiche: statistiche });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(UseraName, { userName: this.state.userName }),
        React.createElement(
          'div',
          { className: 'grid-container grid-container__nested' },
          React.createElement(
            'div',
            { className: 'hidden-xs hidden-sm grid-cl-4-desktop' },
            React.createElement(
              'div',
              null,
              React.createElement('img', { src: this.state.userIcon, alt: 'user-icon' })
            )
          ),
          React.createElement(
            'div',
            { className: 'grid-cl-2-mobile grid-cl-6-tablet grid-cl-7-desktop' },
            React.createElement(Statistiche, { statistiche: this.state.statistiche })
          ),
          React.createElement(
            'div',
            { className: 'grid-cl-2-mobile grid-cl-6-tablet grid-cl-1-desktop statistiche__container-link' },
            React.createElement(
              'a',
              { href: url_link },
              label_link
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

  function UseraName() {
    _classCallCheck(this, UseraName);

    return _possibleConstructorReturn(this, (UseraName.__proto__ || Object.getPrototypeOf(UseraName)).apply(this, arguments));
  }

  _createClass(UseraName, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'h2',
        { className: 'title' },
        this.props.userName
      );
    }
  }]);

  return UseraName;
}(React.Component);

var Statistiche = function (_React$Component3) {
  _inherits(Statistiche, _React$Component3);

  function Statistiche() {
    _classCallCheck(this, Statistiche);

    return _possibleConstructorReturn(this, (Statistiche.__proto__ || Object.getPrototypeOf(Statistiche)).apply(this, arguments));
  }

  _createClass(Statistiche, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'statistiche' },
        React.createElement(
          'p',
          null,
          'Vittorie: ',
          this.props.statistiche.victories
        ),
        React.createElement(
          'p',
          null,
          'Sconfitte: ',
          this.props.statistiche.defeats
        ),
        React.createElement(
          'p',
          null,
          'Pareggi: ',
          this.props.statistiche.draws
        )
      );
    }
  }]);

  return Statistiche;
}(React.Component);

export default InfoUtente;