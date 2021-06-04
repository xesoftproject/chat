import LogOut from './LogOut.js';
import InfoUtente from './InfoUtente.js';
import StartGame from './StartGame.js';
import InvitationModal from './InvitationModal.js';
import Chat from './Chat.js';
import {socket_onload} from './socket.js';

socket_onload();

ReactDOM.render(
    <LogOut />,
    document.getElementById('logout')
);

ReactDOM.render(
    <InfoUtente />,
    document.getElementById('info-utente')
);

ReactDOM.render(
    <StartGame />,
    document.getElementById('start-game')
);

ReactDOM.render(
    <InvitationModal />,
    document.getElementById('invitation-modal')
);

ReactDOM.render(
    <Chat />,
    document.getElementById('chat')
);