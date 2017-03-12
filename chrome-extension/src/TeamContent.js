import React, { Component } from 'react';
import { RepoContent, SubNav, SubNavItem, SectionContainer,
    SectionTitle, SectionHeader, SectionButtonGroup, PrimaryButton,
    PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious } from './elements';
import 'primer-css/build/build.css';
import { changeLocationHash, getOwnerAndRepo } from './pageHelper';
import * as model from './model';

var octicons = require("octicons");

const GroupSubNav = (props) => {

  const groups = props.groups.map((group, i) => {
    return <SubNavItem key={i} label={group.displayName} selected={group.id === props.selectedGroupId} onClick={function (e) {
      e.preventDefault();
      props.handleNavSelect(group.id);
    }} />
  });

  return (
    <SubNav>
      {groups}
    </SubNav>
  );
};

const GroupInfo = (props) => {

  const group = props.groups.find(function (g) {
    return g.id === props.selectedGroupId;
  });

  const isMember = props.members.findIndex(function (member) {
    return member === "wow";
  }) > -1;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{group.displayName}</SectionTitle>
        <SectionButtonGroup>
          {isMember ?
            <DangerButton>Leave Team</DangerButton>
            : <PrimaryButton onClick={props.handleJoinGroup}>Join Team</PrimaryButton>}
        </SectionButtonGroup>
      </SectionHeader>
      <p className="lead">{group.description}</p>
    </SectionContainer>
  );
}

const GroupMembers = (props) => {

  const group = props.groups.find(function (g) {
    return g.id === props.selectedGroupId;
  });

  const noMember = (props.members.length === 0);

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Members</SectionTitle>
      </SectionHeader>
      {noMember && <NoMembers groupName={group.displayName} handleJoinGroup={props.handleJoinGroup} />}
    </SectionContainer>
  );
}

const NoGroups = (props) => {
  const heading = "There aren't any groups.";
  const description = "Create groups to organize your team's internal structure.";
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicons.octoface.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleCreateGroupSelect}>Create Team</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  )
}

const NoMembers = (props) => {
  const heading = `There aren't any members in ${props.groupName}.`;
  return (
    <BlankSlate heading={heading} icon={octicons.hubot.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleJoinGroup}>Join Team</PrimaryButtonSmall></p>
    </BlankSlate>
  )
}

class TeamContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedGroupId: parseInt(props.query.id) || 1,
      groups: null,
      members: null,
    };
  };

  getGroups() {
    const {ownerName, repoName} = getOwnerAndRepo();
    const requestData = {
      repo: repoName,
      id: this.state.selectedGroupId,
    };

    model.getTeamGroups(requestData, function(data) {
      this.setState({
        groups: data.groups,
      });
    }.bind(this));
  };

  getGroupMembers() {
    const {ownerName, repoName} = getOwnerAndRepo();
    const requestData = {
      repo: repoName,
      id: this.state.selectedGroupId,
    };

    model.getTeamMembers(requestData, function(data) {
      this.setState({
        members: data.members,
      });
    }.bind(this));
  };

  componentWillMount() {
    this.getGroups();
    this.getGroupMembers();
  };

  handleNavSelect = (groupId) => {
    window.history.pushState({}, "", "#Team?id=" + groupId);
    this.setState({
      selectedGroupId: groupId,
    });

    this.getGroupMembers();
  };

  handleCreateGroupSelect = () => {
    changeLocationHash("#Team?action=new");
  };

  handleJoinGroup = () => {
    const {ownerName, repoName} = getOwnerAndRepo();
    const requestData = {
      repo: repoName,
      id: this.state.selectedGroupId,
    };

    model.joinTeamGroup(requestData, function(data) {
      this.getGroupMembers();
    }.bind(this));
  };

  render() {
    return (
      <RepoContent>
        {
          (this.state.groups && this.state.groups.length > 0 && this.state.members) ?
          <div>
            <GroupSubNav groups={this.state.groups} selectedGroupId={this.state.selectedGroupId} handleNavSelect={this.handleNavSelect} />
            <SectionButtonGroup>
              <PrimaryButton onClick={this.handleCreateGroupSelect}>Create Team</PrimaryButton>
            </SectionButtonGroup>
            <GroupInfo groups={this.state.groups} members={this.state.members} selectedGroupId={this.state.selectedGroupId} handleJoinGroup={this.handleJoinGroup} />
            <GroupMembers groups={this.state.groups} members={this.state.members} selectedGroupId={this.state.selectedGroupId} handleJoinGroup={this.handleJoinGroup} />
          </div>
          :
          <div>
            {<NoGroups handleCreateGroupSelect={this.handleCreateGroupSelect} />}
          </div>
        }
      </RepoContent>
    );
  };
}

export default TeamContent;