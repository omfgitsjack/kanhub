import React, { Component } from 'react';
import { TeamSubNav, TeamSection, TeamIssues, TeamLabel, TeamInfo, NoTeamFound, NoTeams, TeamMembers, NoMembers } from '../components/components';
import { SectionButtonGroup, NormalButton, DangerButton, PrimaryButton, RepoContent, SubNav, NavHeader, SectionContainer, SectionHeader, SectionTitle } from '../../github_elements/elements';
import { changeLocationHash } from '../../pageHelper';
import LoadingHOC from '../../hocs/LoadingHOC';
import * as model from '../model/model';
import { getRepoIssues, getSingleLabel } from '../../modelCommon';
import { List } from 'immutable';
import StandupArchive from '../components/StandupArchive';

class TeamContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || (this.props.teams.length > 0 && this.props.teams[0].id),
      members: List(),
      issues: List(),
      openIssues: List(),
      closedIssues: List(),
      label: {},
    };
  };

  getTeamMembers(teamId) {
    const requestData = {
      repo: this.props.repo,
      id: teamId,
    };

    return model.getTeamMembers(requestData).then(function (data) {
      return model.getTeamMembersInfo({ members: data }).then(function (members) {
        return {
          members: members,
          selectedTeamId: teamId,
        };
      }.bind(this));
    }.bind(this));
  };

  getTeamIssues(teamId) {

    const team = this.props.teams.find(function (team) {
      return team.id === teamId;
    }.bind(this));

    if (!team || !team.label) {
      return {
        openIssues: List(),
        closedIssues: List(),
        issues: [],
        label: {},
      };
    }

    const requestData = {
      repo: this.props.repo,
      owner: this.props.owner,
      label: team.label,
    }

    // get label assigned to this team
    return getSingleLabel(requestData).then((label) => {
      return getRepoIssues(requestData).then((issues) => {

        let openIssues = [];
        let closedIssues = [];
        
        issues.map(function(issue) {
          if (issue.state === 'open') {
            openIssues.push(issue);
          } else if (issue.state === 'closed') {
            closedIssues.push(issue);
          }
        });

        return {
          openIssues: openIssues,
          closedIssues: closedIssues,
          issues: issues,
          label: label,
        };
      });
    });
  };

  _loadTeamInfo(teamId) {
    if (this.props.teams && this.props.teams.length > 0) {
      window.history.pushState({}, "", "#Team?id=" + teamId);

      this.props.setLoading(true, function() {
        Promise.all([this.getTeamMembers(teamId), this.getTeamIssues(teamId)]).then((res) => {
          this.setState({
            members: List(res[0].members),
            selectedTeamId: res[0].selectedTeamId,
            openIssues: List(res[1].openIssues),
            closedIssues: List(res[1].closedIssues),
            issues: List(res[1].issues),
            label: res[1].label,
          }, function() {
            this.props.setLoading(false);
          });
        });
      }.bind(this));
    }
  }

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {
      const teamId = (this.state.selectedTeamId || this.props.teams[0].id);
      this._loadTeamInfo(teamId);
    }
  };

  handleNavSelect = (teamId) => {
    this._loadTeamInfo(teamId);
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

    this.props.setLoading(true, function() {
      model.joinTeam(requestData).then(function (data) {
        this.getTeamMembers(this.state.selectedTeamId).then(function (members) {
          this.setState({
            members: List(members.members),
            selectedTeamId: members.selectedTeamId,
          }, function() {
            this.props.setLoading(false);
          });
        }.bind(this));
      }.bind(this));
    }.bind(this));

  };

  handleLeaveTeam = () => {
    const requestData = {
      repo: this.props.repo,
      id: this.state.selectedTeamId,
      username: this.props.username,
    };

    this.props.setLoading(true, function() {
      model.leaveTeam(requestData).then(function (data) {
        this.getTeamMembers(this.state.selectedTeamId).then(function (members) {
          this.setState({
            members: List(members.members),
            selectedTeamId: members.selectedTeamId,
          }, function() {
            this.props.setLoading(false);
          });
        }.bind(this));
      }.bind(this))
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
                    <DangerButton extraClass="ml-2" onClick={this.handleLeaveTeam}>Leave Team</DangerButton>
                    <NormalButton extraClass="ml-2" onClick={this.handleEditTeamSelect}>Edit Team</NormalButton>
                  </div>
                  : <PrimaryButton extraClass="ml-2" onClick={this.handleJoinTeam}>Join Team</PrimaryButton>}
                <PrimaryButton extraClass="ml-2" onClick={this.handleCreateTeamSelect}>New Team</PrimaryButton>
              </SectionButtonGroup>
            </NavHeader>
            <SectionContainer>
              <SectionHeader>
                <SectionTitle>{team.displayName}</SectionTitle>
                <TeamLabel label={this.state.label}/>
              </SectionHeader>
              <TeamInfo description={team.description} />
            </SectionContainer>
            <TeamSection heading="Overview">
              <TeamIssues owner={this.props.owner} repo={this.props.repo} label={this.state.label.name} openIssues={this.state.openIssues} closedIssues={this.state.closedIssues} issues={this.state.issues} />
            </TeamSection>
            <TeamSection heading="Members">
              {this.state.members.size > 0 ?
              <TeamMembers members={this.state.members} /> :
              <NoMembers teamName={team.displayName} handleJoinTeam={this.handleJoinTeam} />}
            </TeamSection>
            <TeamSection heading="Standup Archive">
              <StandupArchive owner={this.props.owner} repo={this.props.repo} selectedTeamId={this.state.selectedTeamId} />
            </TeamSection>
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