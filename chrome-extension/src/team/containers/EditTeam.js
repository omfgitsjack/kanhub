import React, { Component } from 'react';
import { RepoContent } from '../../github_elements/elements';
import { EditTeamForm, NoTeamFound } from '../components/components';
import 'primer-css/build/build.css';
import * as pageHelper from '../../pageHelper';
import * as model from '../model/model';

class EditTeam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teamName: "",
      teamDescription: "",
      team: null,
    }
  };

  componentDidMount() {
    if (this.props.repo && this.props.query && this.props.query.id) {
        model.getTeam({repo: this.props.repo, id: this.props.query.id}).then(function(team) {
          this.setState({
            teamName: team.displayName,
            teamDescription: team.description,
            team: team,
          });
        }.bind(this));
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

  handleEditTeamSelect = () => {
    const requestData = {
      id: this.props.query.id,
      repo: this.props.repo,
      teamEdit: {
        displayName: this.state.teamName,
        description: this.state.teamDescription,
      },
    }

    model.editTeam(requestData).then(function (data) {
      pageHelper.changeLocationHash("#Team?id=" + this.props.query.id);
    }.bind(this));
  };

  handleCancelTeamSelect = () => {
    pageHelper.changeLocationHash("#Team");
  };

  render() {

    if (this.state.team) {
      return (
        <RepoContent>
          <EditTeamForm team={this.state.team} teamName={this.state.teamName} teamDescription={this.state.teamDescription} {...this} />
        </RepoContent>
      );
    } else {
      return (
        <NoTeamFound />
      );
    }
  };
}

export default EditTeam;