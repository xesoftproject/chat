'use strict';
import  {socket} from './socket.js'

const socketId = socket;
const modal = document.getElementById("invitation-modal");

class InvitationModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            friendGameLink:null,
            friendInvitationGame:null
        };
    }

    onClick(event) {
        event.preventDefault();
        modal.classList.add("hide");	
    }

    componentDidMount() {       
		socketId.on('invitation', (data) => {
			console.log('on message vito %o', data);

            this.setState({
                friendGameLink:data.link,
                friendInvitationGame:data.from
            });
            modal.classList.remove("hide");
        });
    }

    render(){
        return (
            <div className="modal-wrapper">
                <span onClick={this.onClick} className="close">&times;</span>
                <p>{this.state.friendInvitationGame} ti ha invitato a giocare!</p>
                <div className="button__wrapper">
                    <a href={this.state.friendGameLink} className="button__content">Inizia partita</a>
                </div>
            </div>
        )
    }
}

export default InvitationModal;