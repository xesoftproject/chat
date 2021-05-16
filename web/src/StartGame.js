'use strict';

import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';
import { get_username } from './cognitoclient.js';

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
        /*TO DO LISTA AMICI*/
        var friends = ["giovanni", "mario"];
        var options = [];
        friends.forEach(function(items){
            options.push(
                { value: items, label: items }
            )
        })
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

class FormGroupSelect extends React.Component{
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    
    onChange(event,needCallback,checkValue) {
        console.log(needCallback)
        needCallback = (needCallback == 'true')
        if(needCallback){
            if(event.target.value === checkValue){
                this.props.parentCallback(true);
            }else{
                this.props.parentCallback(false);
            }
        }

        event.preventDefault();
    }
    render(){
        const options = this.props.options;
        const needCallback = this.props.needCallback;
        const checkValue = this.props.checkValue;

        return (
            <div className={"form__group__wrapper " + this.props.className}>
                <select id={this.props.data} name={this.props.data} onChange={(event) => this.onChange(event,needCallback,checkValue)}>
                    {options.map((item, index) => {
                        return <option value={item.value} key={index}>{item.label}</option>;
                    })}
                </select>
                <label htmlFor={this.props.data} className="form-group__label">{this.props.label}</label>
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

		const game_id = start_new_game(this.props.userId, white, black).then(function(){
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