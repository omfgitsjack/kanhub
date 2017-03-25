import React, { Component } from 'react';
import { RepoContent, SectionContainer, PrimaryButton, NormalButton, SectionHeader, SectionTitle } from '../../github_elements/elements';
import { SelectLabelList, NoTeamFound } from '../components/components';
import * as pageHelper from '../../pageHelper';
import * as model from '../model/model';

class EditTeam extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teamName: "",
      teamDescription: "",
      teamLabel: "",
      team: null,
    }

    this.handleOnSelectChange = this.handleOnSelectChange.bind(this);
  };

  componentDidMount() {
    if (this.props.repo && this.props.query && this.props.query.id) {
        model.getTeam({repo: this.props.repo, id: this.props.query.id}).then(function(team) {
          this.setState({
            teamName: team.displayName,
            teamDescription: team.description,
            teamLabel: team.label,
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
        label: this.state.teamLabel,
      },
    }

    model.editTeam(requestData).then(function (data) {
      pageHelper.changeLocationHash("#Team?id=" + this.props.query.id);
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

    if (this.state.team) {
      return (
        <RepoContent>
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>{'Editing ' + this.state.team.displayName}</SectionTitle>
            </SectionHeader>
            <form>
              <dl className="form-group">
                <dt><label>Team Name</label></dt>
                <dd><input className="form-control" type="text" placeholder="Team name" value={this.state.teamName} onChange={this.handleTeamNameChange}/></dd>
              </dl>

              <dl className="form-group">
                <dt><label>Team Label</label></dt>
                <dd><SelectLabelList labels={this.props.labels} teamLabel={this.state.teamLabel} handleOnSelectChange={this.handleOnSelectChange}/></dd>
              </dl>

              <dl className="form-group">
                <dt><label>Team Description</label></dt>
                <dd>
                  <textarea className="form-control" placeholder="Briefly describe what this team is for..." value={this.state.teamDescription} onChange={this.handleTeamDescriptionChange}></textarea>
                </dd>
              </dl>
              <hr/>
              <div className="form-actions">
                <PrimaryButton onClick={this.handleEditTeamSelect}>Save</PrimaryButton>
                <NormalButton onClick={this.handleCancelTeamSelect}>Cancel</NormalButton>
              </div>
            </form>
          </SectionContainer>
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