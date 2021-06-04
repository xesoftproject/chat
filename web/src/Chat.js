'use strict';
import  {socket} from './socket.js'

const socketId = socket;

class Chat extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    toggleChat(event) {
        event.preventDefault();
        const chat_content = document.getElementById("chat-content");
        
        if(chat_content.classList.contains("hide")){
            chat_content.classList.remove("hide");	
        }else{
            chat_content.classList.add("hide");	
        }

    }

    render(){
        return (
            <div>
                <div id="chat-content" className="hide">
                    <h4>CHAT GLOBALE</h4>
                    <div className="chat_text-wrapper">
                        <div className="chat_text-area">
                            <div id="message-room">
                                <ul>
                                    <li>ciaooo</li>
                                    <li>cooome</li>
                                    <li>vaaaaa</li>
                                </ul>
                            </div>
                        </div>
                        <div className="chat_send-msg-wrapper">
                            <input id="message" type="text" placeholder="Scrivi messaggio..."/>
                            <div className="button__send-msg">
                                <img id="roomID" data-roomid="dating" src="../img/send-msg.svg" alt="invia msg"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="chat-btn" onClick={this.toggleChat} className="chat_button-wrapper">
                    <img src="../img/chat.png" alt="chat"/>
                </div>
            </div>
        )
    }
}

export default Chat;