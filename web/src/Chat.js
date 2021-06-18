'use strict';
import  {socket,jwtStr,roomID} from './socket.js'

class Chat extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            messages : []
        };
    }
    
    componentDidMount() {
        let temp_messages = this.state.messages;

        socket.on('history', (data) => {
            console.log("history: ");
            data.Items.forEach(function (element) {
                console.log(element);
                temp_messages.push(
                    {
                        "message":element.msg.S,
                        "nickname": element.senderNickname.S,
                        "date":  new Date(parseInt(element.creationDate.S)).toLocaleString()
                    }
                )
            });

            this.setState(
                {
                    messages : temp_messages
                },
                function() { 
                    const chat_text_area = document.getElementById("message-room");
                    chat_text_area.scrollTop = chat_text_area.scrollHeight;
                }
            );
        });
        
        socket.on('message', (data) => {
			console.log("message: " + data.message+" nickname: "+data.nickname);

            if(data.message != undefined && data.nickname != undefined){
                temp_messages.push(
                    {
                        "message":data.message,
                        "nickname":data.nickname,
                        "date": new Date(data.creationDate).toLocaleString()
                    }
                )
            }

            this.setState(
                {
                    messages : temp_messages
                },
                function() { 
                    const chat_text_area = document.getElementById("message-room");
                    chat_text_area.scrollTop = chat_text_area.scrollHeight;
                }
            );

            
        });
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

    sendMsg(event) {
        event.preventDefault();
        var message = document.getElementById("message").value;
        console.log("clik submit msg: " + message);

        if (message.length > 0) {
            console.log("emitting roomID: " + roomID);
            socket.emit('room-manager', {
                room: roomID,
                message: message,
                jwt: jwtStr,
                msgType: "chat"
            });
            document.getElementById("message").value = "";
        }
    }

    render(){
        return (
            <div>
                <div id="chat-content" className="hide">
                    <h4 className="chat-title">CHAT GLOBALE <span onClick={this.toggleChat} className="close">&times;</span></h4>
                    <div className="chat_text-wrapper">
                        <div className="chat_text-area">
                            <div id="message-room">
                                    {this.state.messages.map((value, index) => {
                                        return (
                                            <div key={index} className="chat-msg-box">
                                                <h4 className="chat-nickname">{value.nickname} <span className="chat-date">{value.date}</span></h4>
                                                <p>{value.message}</p>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                        <div className="chat_send-msg-wrapper">
                            <input id="message" type="text" placeholder="Scrivi messaggio..."/>
                            <div className="button__send-msg" onClick={this.sendMsg}>
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