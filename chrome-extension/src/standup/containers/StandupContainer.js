import React, { Component } from 'react';
import { NotInTeam, Chat } from '../components/components';
import { TeamSubNav } from '../../team/components/components';
import { changeLocationHash } from '../../pageHelper';
import * as model from '../model/model';

class StandupContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || this.props.teams[0].id,
    };
  };

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {
      
    }
  };

  handleNavSelect = (teamId) => {
    window.history.pushState({}, "", "#Standup?id=" + teamId);
  };


  handleFindTeam() {
    changeLocationHash("#Team");
  }

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {
        return (
          <div>
            <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
            <Chat>
            </Chat>
          </div>
        );
      } else {
        return (
          <NotInTeam handleFindTeam={this.handleFindTeam} />
        );
      }
    }
  };
}

export default StandupContainer;