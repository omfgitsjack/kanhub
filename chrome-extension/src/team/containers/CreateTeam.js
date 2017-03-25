import React, { Component } from 'react';
import { RepoContent } from '../../github_elements/elements';
import { CreateTeamForm } from '../components/components';
import 'primer-css/build/build.css';
import * as pageHelper from '../../pageHelper';
import * as model from '../model/model';

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
    const requestData = {
      repo: this.props.repo,
      rawTeam: {
        displayName: this.state.teamName,
        repository: this.props.repo,
        description: this.state.teamDescription,
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

  render() {
    return (
      <RepoContent>
        <CreateTeamForm {...this} />
      </RepoContent>
    );
  };
}

export default CreateTeam;