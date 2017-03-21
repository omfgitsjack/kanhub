import React, { Component } from 'react';
import { TeamSubNav, TeamInfo, NoTeams, TeamMembers, NoMembers } from '../components/components';
import { SectionButtonGroup, PrimaryButton } from '../../github_elements/elements';
import { changeLocationHash } from '../../pageHelper';
import * as model from '../model/model';

class TeamContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id),
      members: [],
    };
  };

  getTeamMembers(teamId) {
    const requestData = {
      repo: this.props.repo,
      id: teamId,
    };

    model.getTeamMembers(requestData).then(function (data) {
      model.getTeamMembersInfo({members: data}).then(function(members) {
        this.setState({
          members: members,
          selectedTeamId: teamId,
        });
      }.bind(this));
    }.bind(this));
  };

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {
      this.getTeamMembers(this.state.selectedTeamId || this.props.teams[0].id);
    }
  };

  handleNavSelect = (teamId) => {
    window.history.pushState({}, "", "#Team?id=" + teamId);
    this.setState({
      selectedTeamId: teamId,
    });

    this.getTeamMembers(teamId);
  };

  handleCreateTeamSelect = () => {
    changeLocationHash("#Team?action=new");
  };

  handleJoinTeam = () => {
    const requestData = {
      repo: this.props.repo,
      id: this.state.selectedTeamId,
    };

    model.joinTeam(requestData).then(function(data) {
      this.getTeamMembers(this.state.selectedTeamId);
    }.bind(this));
  };

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        let isMember = this.state.members && this.state.members.find(function (member) {
          return member.login === this.props.username;
        }.bind(this));

        const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
        }.bind(this));

        return (
          <div>
            <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
            <SectionButtonGroup>
              <PrimaryButton onClick={this.handleCreateTeamSelect}>Create Team</PrimaryButton>
            </SectionButtonGroup>
            <TeamInfo isMember={isMember} team={team} handleJoinTeam={this.handleJoinTeam} />
            {this.state.members.length > 0 ?
              <TeamMembers members={this.state.members} /> :
              <NoMembers teamName={this.props.teams[0].displayName} handleJoinTeam={this.handleJoinTeam} />
            }
          </div>
        );
      } else {
        return (
          <NoTeams handleCreateTeamSelect={this.handleCreateTeamSelect} />
        );
      }
    }
  };
}

export default TeamContent;