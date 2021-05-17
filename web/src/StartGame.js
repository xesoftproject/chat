'use strict';

import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';
import { get_username } from './cognitoclient.js';

import {FormGroupSelect} from './FormComponent.js';

const socket = io(document.location.origin + '/xesoft_chat');
const room ="chat";
const jwt = localStorage.getItem("xejwt");

class StartGame extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            friendsOptions: [],
            dataFromChild : null,
            userId: null,
        };
        this.handleCallback = this.handleCallback.bind(this);
    }

    handleCallback = (childData) =>{
        this.setState({
            dataFromChild: childData, 
        })
    }

    componentDidMount() {
        this.setState({
            friendsOptions: this.getFriendsOptions(),
            userId: get_username()
        });
    }

    getFriendsOptions(){
        var options = [];

        socket.on('room-users-list', function (message) {
            message.users.forEach(function(items){
                if(options.indexOf(items) === -1){
                    options.push(
                        { value: items, label: items }
                    )
                }
            })
        });

        socket.emit('room-users-list', {
			room: room,
			jwt: jwt,
			msgType: "command"
		});

        return options;
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

		start_new_game(this.props.userId, white, black).then(function(game_id){
            console.log('[game_id: %o]', game_id);
            window.location.assign(`${PATH_GAME}?${QUERY_PARAMS_GAME_ID}=${game_id}`);
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