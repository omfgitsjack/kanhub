import React, { Component } from 'react';
import { RepoContent, SubNav, SubNavItem } from './elements';
import 'primer-css/build/build.css';

var octicons = require("octicons");

const styles = {
  groupInfo: {
    marginBottom: "20px",
  },
  groupName: {
    fontSize: "36px",
    marginRight: "10px",
  },
  groupHeader: {
    display: "flex",
    flexDirection: "row",
  },
  groupButtonGroup: {
    display: "flex",
    flexDirection: "row",
    padding: "10px 0px",
  },
  groupButton: {
    marginLeft: "10px",
  },
};

const GroupSubNav = (props) => {

  const groups = props.groups.map((group, i) => {
    return <SubNavItem key={i} label={group.name} selected={group.id === props.selectedGroupId} onClick={function(e) {
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

  const group = props.groups.find(function(g) {
    return g.id === props.selectedGroupId;
  });

  const isMember = group.members.findIndex(function(member) {
    return member === "test";
  }) > -1;

  return (
    <div style={styles.groupInfo}>
      <div style={styles.groupHeader}>
        <div style={styles.groupName}>{group.name}</div>
        <div style={styles.groupButtonGroup}>
          { isMember ? 
            <button style={styles.groupButton} className="btn btn-danger" type="button">Leave Group</button>
          : <button style={styles.groupButton} className="btn btn-primary" type="button">Join Group</button> }
        </div>
      </div>
      <p className="lead">{group.description}</p>
    </div>
  );
}

const GroupMembers = (props) => {

  const group = props.groups.find(function(g) {
    return g.id === props.selectedGroupId;
  });

  const noMember = group.members.length === 0;

  return (
    <div style={styles.groupInfo}>
      <div style={styles.groupName}>Members</div>
      {noMember && <NoMembers groupName={group.name} />}
    </div>
  );
}

const NoGroups = () => {
  const heading = "There aren't any groups.";
  const description = "Create groups to organize your team's internal structure.";
  return (
    <div className="blankslate blankslate-capped blankslate-spacious blankslate-large">
      <div dangerouslySetInnerHTML={{__html: octicons.octoface.toSVG({"width": 45, "height": 45})}}></div>
      <h3>{heading}</h3>
      <p>{description}</p>
      <p><button className="btn btn-sm btn-primary" type="button">Create Group</button></p>
    </div>
  )
}

const NoMembers = ({groupName}) => {
  const heading = `There aren't any members in ${groupName}.`;
  return (
    <div className="blankslate blankslate-capped blankslate-large">
      <div dangerouslySetInnerHTML={{__html: octicons.hubot.toSVG({"width": 45, "height": 45})}}></div>
      <h3>{heading}</h3>
      <p><button className="btn btn-sm btn-primary" type="button">Join Group</button></p>
    </div>
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
        "members": ["github ids of members"],
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

  render() {
    return (
      <RepoContent>
        <GroupSubNav groups={this.props.data} selectedGroupId={this.state.selectedGroupId} handleNavSelect={this.handleNavSelect} />
        <GroupInfo groups={this.props.data} selectedGroupId={this.state.selectedGroupId} />
        <GroupMembers groups={this.props.data} selectedGroupId={this.state.selectedGroupId} />
        <NoGroups />
      </RepoContent>
    );
  };
}

export default TeamContent;