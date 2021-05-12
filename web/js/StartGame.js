'use strict';

let template = `
<div>
    <h2>This is ComponentTwo</h2>
    
</div>
`;

class StartGame extends React.Component{
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    render(){
        return (eval(Babel.transform(template, { presets: ['es2017', 'react'] }).code))
    }
}

export default StartGame;
