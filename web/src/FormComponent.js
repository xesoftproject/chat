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

class FormGroupInputEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    
    handleChange(event) {    
        this.setState({value: event.target.value});  
    }
  
    render() {
        return (
            <div className="form__group__wrapper">
                <input type="email" id={this.props.id} name={this.props.id} value={this.state.value} onChange={this.handleChange} required/>
                <label htmlFor={this.props.id} className="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

class FormGroupInputPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {    
        this.setState({value: event.target.value});  
    }
  
    render() {
        return (
            <div className="form__group__wrapper">
                <input type="password" id={this.props.id} name={this.props.id} minLength="8" value={this.state.value} onChange={this.handleChange} required/>
                <label htmlFor={this.props.id} className="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

class FormGroupInputText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {    
        this.setState({value: event.target.value});  
    }
  
    render() {
        return (
            <div className="form__group__wrapper">
                <input type="text" id={this.props.id} name={this.props.id} value={this.state.value} onChange={this.handleChange} required/>
                <label htmlFor={this.props.id} className="form-group__label">{this.props.label}</label>
            </div>
        )
    }
}

export {FormGroupSelect,FormGroupInputEmail,FormGroupInputPwd,FormGroupInputText};