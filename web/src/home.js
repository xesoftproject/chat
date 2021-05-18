import LogOut from './LogOut.js';
import InfoUtente from './InfoUtente.js';
import StartGame from './StartGame.js';
import socket_onload from './socket.js';

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
