import React, { Component } from 'react';
import { NotInTeam, Chat, WaitingRoom, StandupBox, StandupProfile, StandupCard } from '../components/components';
import { TeamSubNav } from '../../team/components/components';
import { changeLocationHash } from '../../pageHelper';
import { createSocket } from '../../socketCommon';
import * as model from '../model/model';

let socket;

class StandupContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || (this.props.teams.length > 0 && this.props.teams[0].id),
      users: new Set(),
      messages: [],
      message: '',
    };
  };

  _onJoinSuccess(lobbyUsers) {
    this.setState({
      users: new Set(lobbyUsers),
    });

    console.log(this.state.users);
  };

  _onMessageReceive(message) {
      let { messages } = this.state;
      messages.push(message);
      this.setState({
        messages: messages,
      });
  };

  _onUserJoin(username) {
      let { users, messages } = this.state;
      users.add(username);
      messages.push({
          author: '!kanhub_bot!',
          content: username +' Joined'
      });
      this.setState({
        users: users,
        messages: messages,
      });

      console.log(users);
  };

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {

      const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
      }.bind(this));

      socket = createSocket(this.props.socketToken);

      socket.on('connect', function () {
        socket.emit('join_lobby', team.displayName + "_" + team.id);
      }.bind(this));

      socket.on('join_lobby_success', this._onJoinSuccess.bind(this));
      socket.on('user_joined_lobby', this._onUserJoin.bind(this));
      }
  };

  handleNavSelect = (teamId) => {
    window.history.pushState({}, "", "#Standup?id=" + teamId);

    this.setState({
      selectedTeamId: teamId,
    });
  };


  handleFindTeam() {
    changeLocationHash("#Team");
  }

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        document.body.style.width = "80%";

        const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
        }.bind(this));

        return (
          <div>
            <Chat teamName={team.displayName}>
            </Chat>
            <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
            <WaitingRoom/>
            <StandupBox>
              <StandupProfile src="https://avatars0.githubusercontent.com/u/4117654?v=3&s=460"/>
              <StandupCard/>
            </StandupBox>
          </div>
        );
      } else {
        return (
          <NotInTeam handleFindTeam={this.handleFindTeam} />
        );
      }
    }
  };
}

export default StandupContainer;