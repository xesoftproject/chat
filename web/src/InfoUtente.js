'use strict';

import { get_username } from './cognitoclient.js';

class InfoUtente extends React.Component {
    render() {
      return (
        <div>
          <UseraName />
          <div className="grid-container grid-container__nested">
              <div className="hidden-xs hidden-sm grid-cl-2-desktop">
                  <div>
                      <img src="" alt="user-icon"/>
                  </div>
              </div>
              <div className="grid-cl-2-mobile grid-cl-6-tablet grid-cl-7-desktop">
                  <div className="statistiche">
                      <p>Vittorie: 0</p>
                      <p>Sconfitte: 0</p>
                      <p>Pareggi: 0</p>
                  </div>
              </div>
              <div className="grid-cl-2-mobile grid-cl-6-tablet grid-cl-3-desktop statistiche__container-link">
                  <a href="#">Storico partite</a>
              </div>
          </div>
        </div>
      )
    }
  }

  class UseraName extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: null};
    }

    componentDidMount() {
      this.setState({name: get_username()});
    }

    render() {
      return (
        <h2 className="title">{this.state.name}</h2>
      )
    }
  }

export default InfoUtente;