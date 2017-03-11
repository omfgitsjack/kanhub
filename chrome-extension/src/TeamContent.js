import React, { Component } from 'react';
import { RepoContent, SubNav, SubNavItem } from './elements';

const GroupSubNav = (props) => {

  const groups = props.data.map((group, i) => {
    return <SubNavItem key={i} label={group.name} selected={group.id === props.selectedGroupId} />
  });

  return (
    <SubNav>
      {groups}
    </SubNav>
  );
};

class TeamContent extends Component {

  constructor(props) {
    super(props);

    //we need data, assume props.data is of the following
    props.data = [
      {
        "id": 0,
        "name": "Backend",
        "description": "this is the backend",
      },
      {
        "id": 1,
        "name": "Frontend",
        "description": "this is the frontend woopy doody ha doody like poop kek",
      },
      {
        "id": 2,
        "name": "jacks playhouse",
        "description": "more liek jacks FUNhouse full of evil clowns start the countdown man",
      },
    ]

  };

  render() {
    return (
      <RepoContent>
        <GroupSubNav data={this.props.data} selectedGroupId={0} />
      </RepoContent>
    );
  };
}

export default TeamContent;