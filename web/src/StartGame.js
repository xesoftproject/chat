'use strict';

class StartGame extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            friendsOptions: [],
            dataFromChild : null
        };
    }

    handleCallback = (childData) =>{
        this.setState({dataFromChild: childData})
    }

    componentDidMount() {
        this.setState({friendsOptions: this.getFriendsOptions()});
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

        console.log(this.state.dataFromChild)

        let friendSelect;

        if (this.state.dataFromChild) {      
            friendSelect = (
                <FormGroupSelect data="friend" options={this.state.friendsOptions} label="Amici" needCallback="false"/>
            ); 
        }

        return (
            <div className="form__group">
                <FormGroupSelect data="color" options={colorOptions} label="Colore" needCallback="false"/>
                <FormGroupSelect data="opponent" options={opponentOptions} label="Sfidante" needCallback="true" parentCallback = {this.handleCallback} checkValue="friend"/>
                {friendSelect}
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
            <div className="form__group__wrapper">
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

export default StartGame;