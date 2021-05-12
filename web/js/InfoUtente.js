'use strict';

let template1 = `
<div>
    <h2>This is ComponentTwo</h2>
    
</div>
`;

class InfoUtente extends React.Component {
    render() {
      return (eval(Babel.transform(template1, { presets: ['es2017', 'react'] }).code))
    }
  }

export default InfoUtente;