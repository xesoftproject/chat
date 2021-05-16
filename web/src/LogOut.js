'use strict';
class LogOut extends React.Component {
    logOutButton(){
        localStorage.removeItem("xejwt");
        window.location = '/login.html';
    }
    render() {
        return (
            <p className="logout" onClick={this.logOutButton}>ESCI</p>
        )
    }
}


export default LogOut;