import React, { Component } from 'react';
import { SectionContainer, SectionHeader, SectionTitle, RepoContent, PrimaryButton, NormalButton } from './elements';
import 'primer-css/build/build.css';

var octicons = require("octicons");

const CreateTeamForm = () => {

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Create New Team</SectionTitle>
      </SectionHeader>
      <form>
        <dl className="form-group">
          <dt><label>Team Name</label></dt>
          <dd><input className="form-control" type="text" placeholder="Team name"/></dd>
        </dl>

        <dl className="form-group">
          <dt><label>Team Description</label></dt>
          <dd>
            <textarea className="form-control" placeholder="Briefly describe what this team is for..."></textarea>
          </dd>
        </dl>

        <div className="form-actions">
          <PrimaryButton>Create</PrimaryButton>
          <NormalButton>Cancel</NormalButton>
        </div>
      </form>
    </SectionContainer>
  );
}

class CreateTeam extends Component {

  constructor(props) {
    super(props);
  };

  handleCreateGroupSelect = () => {

  };

  render() {
    return (
      <RepoContent>
        <CreateTeamForm />
      </RepoContent>
    );
  };
}

export default CreateTeam;