import React, { Component } from 'react';
import { RepoContent, SectionContainer, PrimaryButton, NormalButton, SectionHeader, SectionTitle } from '../../github_elements/elements';
import { SelectLabelList } from '../components/components';
import * as pageHelper from '../../pageHelper';
import * as model from '../model/model';

class CreateTeam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teamName: "",
      teamDescription: "",
      teamLabel: "",
    }

    this.handleOnSelectChange = this.handleOnSelectChange.bind(this);
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
    const requestData = {
      repo: this.props.repo,
      rawTeam: {
        displayName: this.state.teamName,
        repository: this.props.repo,
        description: this.state.teamDescription,
        label: this.state.teamLabel,
      },
    }

    model.createTeam(requestData).then(function(data) {
      const requestData = {
        repo: this.props.repo,
        id: data.id,
      };
      
      model.joinTeam(requestData).then((team) => {
        pageHelper.changeLocationHash("#Team?id=" + data.id);
      });

    }.bind(this));
  };

  handleCancelTeamSelect = () => {
    pageHelper.changeLocationHash("#Team");
  };

  handleOnSelectChange = (value) => {
    this.setState({
      teamLabel: value ? value.value : "",
    });
  };

  render() {
    return (
      <RepoContent>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Create New Team</SectionTitle>
          </SectionHeader>
          <form>
            <dl className="form-group">
              <dt><label>Team Name</label></dt>
              <dd><input className="form-control" type="text" placeholder="Team name" onChange={this.handleTeamNameChange}/></dd>
            </dl>

            <dl className="form-group">
              <dt><label>Team Label</label></dt>
              <dd><SelectLabelList labels={this.props.labels} teamLabel={this.state.teamLabel} handleOnSelectChange={this.handleOnSelectChange}/></dd>
            </dl>

            <dl className="form-group">
              <dt><label>Team Description</label></dt>
              <dd>
                <textarea className="form-control" placeholder="Briefly describe what this team is for..." onChange={this.handleTeamDescriptionChange}></textarea>
              </dd>
            </dl>
            <hr/>
            <div className="form-actions">
              <PrimaryButton onClick={this.handleCreateTeamSelect}>Create</PrimaryButton>
              <NormalButton onClick={this.handleCancelTeamSelect}>Cancel</NormalButton>
            </div>
          </form>
        </SectionContainer>
      </RepoContent>
    );
  };
}

export default CreateTeam;