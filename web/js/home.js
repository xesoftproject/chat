import LogOut from './LogOut.js';
import InfoUtente from './InfoUtente.js';
import StartGame from './StartGame.js';
import InvitationModal from './InvitationModal.js';
import { socket_onload } from './socket.js';

socket_onload();

ReactDOM.render(React.createElement(LogOut, null), document.getElementById('logout'));

ReactDOM.render(React.createElement(InfoUtente, null), document.getElementById('info-utente'));

ReactDOM.render(React.createElement(StartGame, null), document.getElementById('start-game'));

ReactDOM.render(React.createElement(InvitationModal, null), document.getElementById('invitation-modal'));