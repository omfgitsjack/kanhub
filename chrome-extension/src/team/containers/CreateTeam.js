import React, { Component } from 'react';
import { SectionContainer, SectionHeader, SectionTitle, RepoContent, PrimaryButton, NormalButton } from '../../github_elements/elements';
import 'primer-css/build/build.css';
import * as pageHelper from '../../pageHelper';
import * as model from '../model/model';

var octicons = require("octicons");

const CreateTeamForm = (props) => {

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Create New Team</SectionTitle>
      </SectionHeader>
      <form>
        <dl className="form-group">
          <dt><label>Team Name</label></dt>
          <dd><input className="form-control" type="text" placeholder="Team name" onChange={props.handleTeamNameChange}/></dd>
        </dl>

        <dl className="form-group">
          <dt><label>Team Description</label></dt>
          <dd>
            <textarea className="form-control" placeholder="Briefly describe what this team is for..." onChange={props.handleTeamDescriptionChange}></textarea>
          </dd>
        </dl>

        <div className="form-actions">
          <PrimaryButton onClick={props.handleCreateTeamSelect}>Create</PrimaryButton>
          <NormalButton onClick={props.handleCancelTeamSelect}>Cancel</NormalButton>
        </div>
      </form>
    </SectionContainer>
  );
}

class CreateTeam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teamName: "",
      teamDescription: "",
    }
  };

  handleTeamNameChange = (e) => {
    this.setState({
      teamName: e.target.value,
    });
  };

  handleTeamDescriptionChange = (e) => {
    this.setState({
      teamDescription: e.target.value,
    });
  };

  handleCreateTeamSelect = () => {
    const {ownerName, repoName} = pageHelper.getOwnerAndRepo();
    const requestData = {
      repo: repoName,
      rawTeam: {
        displayName: this.state.teamName,
        repository: repoName,
        description: this.state.teamDescription,
      },
    }

    model.createTeam(requestData).then((data) => {
      pageHelper.changeLocationHash("#Team?id=" + data.id);
    });
  };


  handleCancelTeamSelect = () => {
    pageHelper.changeLocationHash("#Team");
  };

  render() {
    return (
      <RepoContent>
        <CreateTeamForm {...this} />
      </RepoContent>
    );
  };
}

export default CreateTeam;