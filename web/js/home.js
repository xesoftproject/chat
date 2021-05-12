import StartGame from './StartGame.js';
import InfoUtente from './InfoUtente.js';

ReactDOM.render(React.createElement(InfoUtente, null), document.getElementById('info'));

ReactDOM.render(React.createElement(StartGame, null), document.getElementById('start-game'));