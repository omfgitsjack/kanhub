import React, { Component } from 'react';
import { NotInTeam, Chat, WaitingRoom, StandupBox, StandupProfile, StandupCard } from '../components/components';
import { TeamSubNav } from '../../team/components/components';
import { changeLocationHash } from '../../pageHelper';
import * as model from '../model/model';

class StandupContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || (this.props.teams.length > 0 && this.props.teams[0].id),
    };
  };

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {
      
    }
  };

  handleNavSelect = (teamId) => {
    window.history.pushState({}, "", "#Standup?id=" + teamId);

    this.setState({
      selectedTeamId: teamId,
    });
  };


  handleFindTeam() {
    changeLocationHash("#Team");
  }

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
        }.bind(this));

        return (
          <div>
            <Chat teamName={team.displayName}>
            </Chat>
            <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
            <WaitingRoom/>
            <StandupBox>
              <StandupProfile src="https://avatars0.githubusercontent.com/u/4117654?v=3&s=460"/>
              <StandupCard/>
            </StandupBox>
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