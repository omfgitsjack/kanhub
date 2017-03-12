import React, { Component } from 'react';
import { RepoContent, SubNav, SubNavItem, SectionContainer,
    SectionTitle, SectionHeader, SectionButtonGroup, PrimaryButton,
    PrimaryButtonSmall, DangerButton, BlankSlate, BlankSlateSpacious } from './elements';
import 'primer-css/build/build.css';
import { changeLocationHash } from './pageHelper';

var octicons = require("octicons");

const GroupSubNav = (props) => {

  const groups = props.groups.map((group, i) => {
    return <SubNavItem key={i} label={group.name} selected={group.id === props.selectedGroupId} onClick={function (e) {
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

  const isMember = group.members.findIndex(function (member) {
    return member === "test";
  }) > -1;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{group.name}</SectionTitle>
        <SectionButtonGroup>
          {isMember ?
            <DangerButton>Leave Group</DangerButton>
            : <PrimaryButton>Join Group</PrimaryButton>}
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

  const noMember = group.members.length === 0;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Members</SectionTitle>
      </SectionHeader>
      {noMember && <NoMembers groupName={group.name} />}
    </SectionContainer>
  );
}

const NoGroups = (props) => {
  const heading = "There aren't any groups.";
  const description = "Create groups to organize your team's internal structure.";
  return (
    <BlankSlateSpacious heading={heading} description={description} icon={octicons.octoface.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall onClick={props.handleCreateGroupSelect}>Create Group</PrimaryButtonSmall></p>
    </BlankSlateSpacious>
  )
}

const NoMembers = ({ groupName }) => {
  const heading = `There aren't any members in ${groupName}.`;
  return (
    <BlankSlate heading={heading} icon={octicons.hubot.toSVG({ "width": 45, "height": 45 })}>
      <p><PrimaryButtonSmall>Join Group</PrimaryButtonSmall></p>
    </BlankSlate>
  )
}

class TeamContent extends Component {

  constructor(props) {
    super(props);

    //we need data, assume props.data is of the following
    props.data = [
      {
        "id": 0,
        "name": "Backend",
        "description": "this is the backend",
        "members": ["github ids of members"],
      },
      {
        "id": 1,
        "name": "Frontend",
        "description": "this is the frontend woopy doody ha doody like poop kek",
        "members": ["{id: github id of member, name: name of member}"],
      },
      {
        "id": 2,
        "name": "jacks playhouse",
        "description": "more liek jacks FUNhouse full of evil clowns start the countdown man",
        "members": [],
      },
    ]

    this.state = {
      selectedGroupId: 0,
    };

  };

  handleNavSelect = (groupId) => {
    this.setState({
      selectedGroupId: groupId,
    });
  };

  handleCreateGroupSelect = () => {
    changeLocationHash("#Team?action=new");
  };

  render() {
    return (
      <RepoContent>
        <GroupSubNav groups={this.props.data} selectedGroupId={this.state.selectedGroupId} handleNavSelect={this.handleNavSelect} />
        <GroupInfo groups={this.props.data} selectedGroupId={this.state.selectedGroupId} />
        <GroupMembers groups={this.props.data} selectedGroupId={this.state.selectedGroupId} />
        <NoGroups handleCreateGroupSelect={this.handleCreateGroupSelect} />
      </RepoContent>
    );
  };
}

export default TeamContent;