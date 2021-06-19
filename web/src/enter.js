import Login from './Login.js';
import Registrazione from './Registrazione.js';

/*MODALE BEGIN - END*/
const close_modal = document.getElementById("close-modal");
const modal_error = document.getElementById("error-modal");
close_modal.onclick = function(event){
    event.preventDefault();
    modal_error.classList.add("hide");
};
/*MODALE ERRORE - END*/

ReactDOM.render(
    <Login />,
    document.getElementById('login-form')
);

ReactDOM.render(
    <Registrazione />,
    document.getElementById('registrazione-form')
);