import Login from './Login.js';
import Registrazione from './Registrazione.js';

ReactDOM.render(React.createElement(Login, null), document.getElementById('login-form'));

ReactDOM.render(React.createElement(Registrazione, null), document.getElementById('registrazione-form'));