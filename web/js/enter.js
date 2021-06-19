import Login from './Login.js';
import Registrazione from './Registrazione.js';

/*MODALE BEGIN - END*/
var close_modal = document.getElementById("close-modal");
var modal_error = document.getElementById("error-modal");
close_modal.onclick = function (event) {
    event.preventDefault();
    modal_error.classList.add("hide");
};
/*MODALE ERRORE - END*/

ReactDOM.render(React.createElement(Login, null), document.getElementById('login-form'));

ReactDOM.render(React.createElement(Registrazione, null), document.getElementById('registrazione-form'));