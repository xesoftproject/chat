import Login from './Login.js';
import Registrazione from './Registrazione.js';

const close_modal = document.getElementById("close-modal");
close_modal.onclick = function(event){
    event.preventDefault();
    close_modal.classList.add("hide");
};

ReactDOM.render(
    <Login />,
    document.getElementById('login-form')
);

ReactDOM.render(
    <Registrazione />,
    document.getElementById('registrazione-form')
);