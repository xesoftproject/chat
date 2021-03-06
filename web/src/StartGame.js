'use strict';

import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';
import { get_username } from './cognitoclient.js';

import {FormGroupSelect} from './FormComponent.js';

import  {roomID,jwtStr,socket} from './socket.js'

const socketId = socket;
const room = roomID;
const jwt = jwtStr

function getFriendsOptions(cb){
    socketId.on('room-users-list', function (message) {
        var options = [];
        message.users.forEach(function(items){
            if(options.indexOf(items) === -1){
                options.push(
                    { value: items, label: items }
                )
            }
        })
        return cb(null,options);
    });

    socketId.emit('room-users-list', {
        room: room,
        jwt: jwt,
        msgType: "command"
    });      
}

class StartGame extends React.Component{
    constructor(props) {
        super(props);

        getFriendsOptions((err, friendsOptions) => this.setState({ 
            friendsOptions 
        }));

        this.state = {
            friendsOptions: [],
            dataFromChild : null,
            userId: null,
            friendGameLink:null,
            friendInvitationGame:null
        };
        this.handleCallback = this.handleCallback.bind(this);
    }

    handleCallback = (childData) =>{
        this.setState({
            dataFromChild: childData
        })
    }

    componentDidMount() {
        this.setState({
            userId: get_username()
        });
        
		socketId.on('invitation', (data) => {
			console.log('on message vito %o', data);

            this.setState({
                friendGameLink:data.link,
                friendInvitationGame:data.from
            });
        });
    }

    render(){
        const colorOptions = [
            { value: 'white', label: 'Bianco' },
            { value: 'black', label: 'Nero' }
        ]
        const opponentOptions = [
            { value: 'cpu', label: 'CPU' },
            { value: 'friend', label: 'Amico' }
        ]

        return (
            <div className="form__group">
                <FormGroupSelect data="color" options={colorOptions} label="Colore" needCallback="false" className=""/>
                
                <FormGroupSelect data="opponent" options={opponentOptions} label="Sfidante" className=""
                needCallback="true" parentCallback = {this.handleCallback} checkValue="friend"/>
                
                <FormGroupSelect className={this.state.dataFromChild ? "visibility-visible" : "visibility-hidden"}  data="friend" 
                options={this.state.friendsOptions} label="Amici" needCallback="false"/>
                
                <StartGameButton userId={this.state.userId} />
            </div>
        )
    }
}

class StartGameButton extends React.Component{
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

   onClick(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target.form);
        console.log(formData.get("color"))

        const color = formData.get("color");
		const opponent = formData.get("opponent");
		const friend =formData.get("friend");
		console.log('[color: %o, opponent: %o, friend: %o]', color, opponent, friend);

		const white = color === 'white' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
		const black = color === 'black' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
		console.log('[white: %o, black: %o]', white, black);

		start_new_game(this.props.userId, white, black, friend).then(function(game_id){
            console.log('[game_id: %o]', game_id);

			const game_url = `${PATH_GAME}?${QUERY_PARAMS_GAME_ID}=${game_id}`;
			console.log('[game_url: %o]', game_url);

			if (opponent === 'friend')
				socketId.emit('play_with_me_room', {
					room: 'partita_TODO',
					jwt: jwt,
					msgType: 'command',
					nickname: friend,
					link: game_url
				});

            window.location.assign(game_url);
        })		
    }

    render(){
        return (
            <div className="button__wrapper">
                <button onClick={this.onClick} type="submit" className="button__content">Inizia partita</button>
            </div>
        )
    }
}

export default StartGame;