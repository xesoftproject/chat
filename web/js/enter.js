import Login from './Login.js';
import Registrazione from './Registrazione.js';

/*MODALE ERRORE - BEGIN*/
var close_modal_error = document.getElementById("close-modal-error");
var modal_error = document.getElementById("error-modal");

close_modal_error.onclick = function (event) {
    event.preventDefault();
    modal_error.classList.add("hide");
};
/*MODALE ERRORE - END*/

/*MODALE REGITSRAIONE AVVENUTA - BEGIN*/
var close_modal_registration_success = document.getElementById("close-modal-registration-success");
var registration_success_modal = document.getElementById("registration-success-modal");

close_modal_registration_success.onclick = function (event) {
    event.preventDefault();
    registration_success_modal.classList.add("hide");
};
/*MODALE REGITSRAIONE AVVENUTA - END*/

ReactDOM.render(React.createElement(Login, null), document.getElementById('login-form'));

ReactDOM.render(React.createElement(Registrazione, null), document.getElementById('registrazione-form'));