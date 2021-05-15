'use strict';

const colorOptions = [
    { value: 'white', label: 'Bianco' },
    { value: 'black', label: 'Nero' }
]

const opponentOptions = [
    { value: 'cpu', label: 'CPU' },
    { value: 'friend', label: 'Amico' }
]

class StartGame extends React.Component{
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    render(){
        return (
            <div className="form__group">
                <FormGroupElements name="color" id="colori" options={colorOptions} label="Colore" htmlFor="colors"/>
                <FormGroupElements name="opponent" id="opponent" options={opponentOptions} label="Sfidante" htmlFor="opponent"/>
            </div>
        )
    }
}

class FormGroupElements extends React.Component{
    render(){
        return (
            <div className="form__group__wrapper">
                <Select name={this.props.name} id={this.props.id} options={this.props.options}/>
                <label htmlFor={this.props.htmlFor} className="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

class Select extends React.Component{
    
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    
    onChange(event) {
        console.log(event.target.value);
    }

    render(){
        const options = this.props.options;
        return(
            <select id={this.props.id} name={this.props.name} onChange={this.onChange}>
                {options.map((item, index) => {
                  return <option value={item.value} key={index}>{item.label}</option>;
                })}
            </select>
        )
    }
}

export default StartGame;