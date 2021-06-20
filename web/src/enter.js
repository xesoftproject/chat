import Login from './Login.js';
import Registrazione from './Registrazione.js';

/*MODALE ERRORE - BEGIN*/
const close_modal_error = document.getElementById("close-modal-error");
const modal_error = document.getElementById("error-modal");

close_modal_error.onclick = function(event){
    event.preventDefault();
    modal_error.classList.add("hide");
};
/*MODALE ERRORE - END*/

/*MODALE REGITSRAIONE AVVENUTA - BEGIN*/
const close_modal_registration_success = document.getElementById("close-modal-registration-success");
const registration_success_modal = document.getElementById("registration-success-modal");

close_modal_registration_success.onclick = function(event){
    event.preventDefault();
    registration_success_modal.classList.add("hide");
};
/*MODALE REGITSRAIONE AVVENUTA - END*/

ReactDOM.render(
    <Login />,
    document.getElementById('login-form')
);

ReactDOM.render(
    <Registrazione />,
    document.getElementById('registrazione-form')
);