import Login from './Login.js';
import Registrazione from './Registrazione.js';

/*MODALE BEGIN - END*/
const close_modal = document.getElementById("close-modal");
const modal_error = document.getElementById("error-modal");
const registration_success_modal = document.getElementById("registration-success-modal");

close_modal.onclick = function(event){
    event.preventDefault();

    if(modal_error.offsetWidth > 0 && modal_error.offsetHeight > 0){
        modal_error.classList.add("hide");
    }
    
    if(registration_success_modal.offsetWidth > 0 && registration_success_modal.offsetHeight > 0){
        registration_success_modal.classList.add("hide");
    }
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