'use strict';

import { get_username } from './cognitoclient.js';
import { player_games_history } from '../js/moves-rest-client.js';

const url_link = "#";
const label_link = "Guida al gioco";

class InfoUtente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      userIcon:"../img/avatar.png",
      statistiche:{
        victories: 0,
        defeats:0,
        draws:0
      }
    };
  }

  componentDidMount() {
    this.setState({userName: get_username()});
    /*TO DO settare l'icona utente*/
      player_games_history(this.state.userName).then(statistiche => {
        this.setState({ statistiche });
    });
  }
  render() {
    return (
      <div>
        <UseraName userName={this.state.userName}/>
        <div className="grid-container grid-container__nested">
            <div className="hidden-xs hidden-sm grid-cl-4-desktop">
                <div>
                    <img src={this.state.userIcon} alt="user-icon"/>
                </div>
            </div>
            <div className="grid-cl-2-mobile grid-cl-6-tablet grid-cl-7-desktop">
              <Statistiche statistiche={this.state.statistiche}/>
            </div>
            <div className="grid-cl-2-mobile grid-cl-6-tablet grid-cl-1-desktop statistiche__container-link">
                <a href={url_link}>{label_link}</a>
            </div>
        </div>
      </div>
    )
  }
}

class UseraName extends React.Component {
  render() {
    return (
      <h2 className="title">{this.props.userName}</h2>
    )
  }
}

class Statistiche extends React.Component {
  render() {
    return (
      <div className="statistiche">
          <p>Vittorie: {this.props.statistiche.victories}</p>
          <p>Sconfitte: {this.props.statistiche.defeats}</p>
          <p>Pareggi: {this.props.statistiche.draws}</p>
      </div>
    )
  }
}

export default InfoUtente;