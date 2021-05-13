import StartGame from './StartGame.js';
import InfoUtente from './InfoUtente.js';

ReactDOM.render(React.createElement(InfoUtente, null), document.getElementById('info-utente'));

ReactDOM.render(React.createElement(StartGame, null), document.getElementById('start-game'));