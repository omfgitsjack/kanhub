import React, { Component } from 'react';
import { NotInTeam, WaitingRoom, StandupBox, StandupProfile } from '../components/components';
import Chat from '../components/Chat';
import StandupCard from '../components/StandupCard';
import { NoTeamFound, TeamSubNav } from '../../team/components/components';
import { SectionButtonGroup, NormalButton, DangerButton, PrimaryButton, RepoContent, NavHeader } from '../../github_elements/elements';
import { changeLocationHash } from '../../pageHelper';
import { createSocket } from '../../socketCommon';
import * as model from '../model/model';

let socket;

class StandupContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || (this.props.teams.length > 0 && this.props.teams[0].id),
      users: {},
      messages: [],
      message: '',
      yesterdayDescription: '',
      todayDescription: '',
      obstaclesDescription: '',
      currentCard: null,
      session: null,
      me: props.user,
    };

    this.handleYesterdayChange = this.handleYesterdayChange.bind(this);
    this.handleTodayChange = this.handleTodayChange.bind(this);
    this.handleObstacleChange = this.handleObstacleChange.bind(this);
    this.handleStartSession = this.handleStartSession.bind(this);
    this.handleEndSession = this.handleEndSession.bind(this);
  };

  _onJoinSuccess(lobbyUsers) {
    model.getAllUserInfo({users: lobbyUsers}).then(function(users) {

      var usersMap = users.reduce(function(map, user) {
        map[user.login] = user;
        return map;
      }, {});

      this.setState({
        users: usersMap,
      });
      
    }.bind(this));
  };

  _onMessageReceive(message) {
      let { messages } = this.state;
      messages.push(message);
      this.setState({
        messages: messages,
      });

      const chatContainer = this.refs['chat'];
      if (chatContainer) {
        const messageContainer = chatContainer.refs['chat-container'];
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight; 
        }
      }
  };

  _onUserJoin(username) {
      let { users, messages } = this.state;

      messages.push({
          author: 'KANHUB_BOT',
          content: username +' joined'
      });

      // user not found in user list, add it
      if (!users[username]) {
        model.getUserInfo({username: username}).then(function(user) {
          users[username] = user;

          this.setState({
            users: users,
            messages: messages,
          });
        }.bind(this));
      } else {
        this.setState({
          messages: messages,
        });
      }
  };

  _onUserLeave(username) {
      let { users, messages } = this.state;
      users[username] = null;
      messages.push({
          author: 'KANHUB_BOT',
          content: username +' left'
      });
      this.setState({
        users: users,
        messages: messages,
      });
  };

  _onSessionStart(session) {
    console.log(session);
    this.setState({
      session: session,
      currentCard: session && session.currentCard,
    });
  };

  _onSessionEnd(sessionId) {
    console.log(sessionId);
    this.setState({
      session: null,
      currentCard: null,
    });
  };

  _onCardReceive(card) {
    console.log(card);
    this.setState({
      currentCard: card,
    });
  }

  componentDidMount() {
    if (this.props.teams && this.props.teams.length > 0) {
      const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
      }.bind(this));

      if (!team) {
        return;
      }

      document.body.style.width = "80%";
      socket = createSocket(this.props.socketToken);

      socket.on('connect', function () {
        socket.emit('join_lobby', team.id, function(teamId, session) {
          this._onSessionStart(session);
        }.bind(this));
      }.bind(this));

      socket.on('join_lobby_success', this._onJoinSuccess.bind(this));
      socket.on('user_joined_lobby', this._onUserJoin.bind(this));
      socket.on('user_left_lobby', this._onUserLeave.bind(this));
      socket.on('message_received', this._onMessageReceive.bind(this));
      socket.on('session_started', this._onSessionStart.bind(this));
      socket.on('session_ended', this._onSessionEnd.bind(this));
      socket.on('current_card', this._onCardReceive.bind(this));
    }
  };

  componentWillUnmount() {
    console.log('unmounting');
    if (socket) {
      socket.disconnect();
    }
  };

  handleMessageChange = (e) => {

    this.setState({
      message: e.target.value,
    });
  };

  handleSendMessage = () => {
    
    if (this.state.message.length === 0) {
      return;
    }

    socket.emit('send_message', this.state.selectedTeamId, this.state.message);

    this.setState({
      message: '',
    });

    // TODO: should probably push message right away here instead of waiting for server
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleSendMessage();
    }
  };

  handleNavSelect = (teamId) => {
    // leave current lobby first
    socket.emit('leave_lobby', this.state.selectedTeamId, function(id) {

      window.history.pushState({}, "", "#Standup?id=" + teamId);

      this.setState({
        selectedTeamId: teamId,
        users: {},
        messages: [],
        message: '',
      }, function() {
        // join new lobby
        socket.emit('join_lobby', teamId, function(teamId, session) {
          this._onSessionStart(session);
        }.bind(this));
      });
    }.bind(this));

  };

  handleFindTeam() {
    changeLocationHash("#Team");
  };

  handleCardChange() {
    if (this.session) {
      socket.emit('card_modified', this.state.selectedTeamId, this.session.sessionId, this.state.currentCard);
    }
  };

  cardDetailsReceived(cardDetails) {
    this.setState(cardDetails);
  };

  handleTextAreaChange(key, value, textAreaRef) {
    let { currentCard } = this.state;

    currentCard[key] = value;

    this.setState({currentCard: currentCard}, function() {
      const standupCard = this.refs['standup-card'];
      const textArea = standupCard && standupCard.refs[textAreaRef];
      if (textArea) {
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';
      }

      this.handleCardChange();
    });
  };

  handleYesterdayChange(e) {
    this.handleTextAreaChange('yesterdayDescription', e.target.value, 'standup-yesterday');
  };

  handleTodayChange(e) {
    this.handleTextAreaChange('todayDescription', e.target.value, 'standup-today');
  };

  handleObstacleChange(e) {
    this.handleTextAreaChange('obstaclesDescription', e.target.value, 'standup-obstacle');
  };

  handleStartSession(e) {
    e.preventDefault();
    socket.emit('start_session', this.state.selectedTeamId, function(session) {
      // if this is called then the session has already begun

    }.bind(this));
  };

  handleEndSession(e) {
    e.preventDefault();

    if (this.state.session) {
      socket.emit('end_session', this.state.selectedTeamId, this.state.session.sessionId, function(err) {
        console.log(err);
      }.bind(this));
    }
  };

  handleNextPerson(e) {
    e.preventDefault();

    if (this.state.session) {
      socket.emit('next_person', this.state.selectedTeamId, this.state.session.sessionId);
    }
  }

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        if (this.state.users.length === 0) {
          return <div></div>;
        }

        const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
        }.bind(this));

        if (!team) {
          return (
            <NoTeamFound />
          );
        }

        let presentingUser;
        if (this.state.session) {
          presentingUser = this.state.users[this.state.session.currentUser];
        }

        return (
          <RepoContent>
            <Chat ref="chat" teamName={team.displayName} messages={this.state.messages} message={this.state.message} {...this} />
            <NavHeader>
              <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
              <SectionButtonGroup>
                {this.state.session && <DangerButton onClick={this.handleEndSession}>End Session</DangerButton>}
              </SectionButtonGroup>
            </NavHeader>
            {!this.state.session ?
            <WaitingRoom handleStartSession={this.handleStartSession} users={this.state.users}/> :
            <StandupBox>
              <StandupProfile username={presentingUser && presentingUser.login} src={presentingUser && presentingUser['avatar_url']}/>
              <StandupCard ref="standup-card"
                presenting={this.state.me.login === presentingUser.login}
                card={this.state.currentCard}
                handleYesterdayChange={this.handleYesterdayChange}
                handleTodayChange={this.handleTodayChange}
                handleObstacleChange={this.handleObstacleChange} />
            </StandupBox>}
          </RepoContent>
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