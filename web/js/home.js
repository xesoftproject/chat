import LogOut from './LogOut.js';
import InfoUtente from './InfoUtente.js';
import StartGame from './StartGame.js';

ReactDOM.render(React.createElement(LogOut, null), document.getElementById('logout'));

ReactDOM.render(React.createElement(InfoUtente, null), document.getElementById('info-utente'));

ReactDOM.render(React.createElement(StartGame, null), document.getElementById('start-game'));