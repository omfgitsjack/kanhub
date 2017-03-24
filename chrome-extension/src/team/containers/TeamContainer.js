import React, { Component } from 'react';
import { TeamSubNav, TeamInfo, NoTeamFound, NoTeams, TeamMembers, NoMembers } from '../components/components';
import { SectionButtonGroup, NormalButton, DangerButton, PrimaryButton, RepoContent, SubNav, NavHeader } from '../../github_elements/elements';
import { changeLocationHash } from '../../pageHelper';
import LoadingHOC from '../../hocs/LoadingHOC';
import * as model from '../model/model';

class TeamContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || (this.props.teams.length > 0 && this.props.teams[0].id),
      members: [],
    };
  };

  getTeamMembers(teamId) {
    const requestData = {
      repo: this.props.repo,
      id: teamId,
    };

    this.props.setLoading(true);

    model.getTeamMembers(requestData).then(function (data) {
      model.getTeamMembersInfo({ members: data }).then(function (members) {
        this.setState({
          members: members,
          selectedTeamId: teamId,
        });

        this.props.setLoading(false);

      }.bind(this));
    }.bind(this));
  };

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {
      window.history.pushState({}, "", "#Team?id=" + (this.state.selectedTeamId || this.props.teams[0].id));
      this.getTeamMembers(this.state.selectedTeamId || this.props.teams[0].id);
    }
  };

  handleNavSelect = (teamId) => {
    window.history.pushState({}, "", "#Team?id=" + teamId);
    this.getTeamMembers(teamId);
  };

  handleCreateTeamSelect = () => {
    changeLocationHash("#Team?action=new");
  };

  handleEditTeamSelect = () => {
    changeLocationHash("#Team?action=edit&id=" + this.state.selectedTeamId);
  };

  handleJoinTeam = () => {
    const requestData = {
      repo: this.props.repo,
      id: this.state.selectedTeamId,
    };

    model.joinTeam(requestData).then(function (data) {
      this.getTeamMembers(this.state.selectedTeamId);
    }.bind(this));
  };

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        const isMember = this.state.members && this.state.members.find(function (member) {
          return member.login === this.props.username;
        }.bind(this));

        const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
        }.bind(this));

        if (!team) {
          return (
            <NoTeamFound />
          );
        }

        return (
          <RepoContent>
            <NavHeader>
              <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
              <SectionButtonGroup>
                {isMember ?
                  <div>
                    <DangerButton extraClass="ml-2">Leave Team</DangerButton>
                    <NormalButton extraClass="ml-2" onClick={this.handleEditTeamSelect}>Edit Team</NormalButton>
                  </div>
                  : <PrimaryButton extraClass="ml-2" onClick={this.handleJoinTeam}>Join Team</PrimaryButton>}
                <PrimaryButton extraClass="ml-2" onClick={this.handleCreateTeamSelect}>New Team</PrimaryButton>
              </SectionButtonGroup>
            </NavHeader>
            <TeamInfo team={team} />
            {this.state.members.length > 0 ?
              <TeamMembers members={this.state.members} /> :
              <NoMembers teamName={team.displayName} handleJoinTeam={this.handleJoinTeam} />
            }
          </RepoContent>
        );
      } else {
        return (
          <RepoContent>
            <NoTeams handleCreateTeamSelect={this.handleCreateTeamSelect} />
          </RepoContent>
        );
      }
    }
  };
}

export default LoadingHOC(TeamContainer);