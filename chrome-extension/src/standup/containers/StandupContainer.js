import React, { Component } from 'react';
import { NotInTeam, WaitingRoom, StandupBox, StandupProfile } from '../components/components';
import Chat from '../components/Chat';
import StandupCard from '../components/StandupCard';
import { NoTeamFound, TeamSubNav } from '../../team/components/components';
import { SpreadSectionButtonGroup, NormalButton, DangerButton, PrimaryButton, RepoContent, NavHeader } from '../../github_elements/elements';
import { changeLocationHash } from '../../pageHelper';
import { createSocket } from '../../socketCommon';
import * as model from '../model/model';
import moment from 'moment';

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
      timeLeft: [0,0],
    };

    this.timer = null;
    this.handleYesterdayChange = this.handleYesterdayChange.bind(this);
    this.handleTodayChange = this.handleTodayChange.bind(this);
    this.handleObstacleChange = this.handleObstacleChange.bind(this);
    this.handleStartSession = this.handleStartSession.bind(this);
    this.handleEndSession = this.handleEndSession.bind(this);
    this.handleNextPerson = this.handleNextPerson.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
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
      }, function() {
        const chatContainer = this.refs['chat'];
        if (chatContainer) {
          const messageContainer = chatContainer.refs['chat-container'];
          if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight; 
          }
        }
      });
  };

  _onMessagesReceive(sessionMessages) {
    let messages = [];
    sessionMessages.reverse().map(function(message) {
      messages.push({username: message.username, message: message.message});
    });

    this.setState({
      messages: messages,
    }, function() {
      const chatContainer = this.refs['chat'];
      if (chatContainer) {
        const messageContainer = chatContainer.refs['chat-container'];
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight; 
        }
      }
    });
  };

  _onUserJoin(username) {
      let { users, messages } = this.state;

      messages.push({
          username: 'KANHUB_BOT',
          message: username +' joined'
      });

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
          username: 'KANHUB_BOT',
          message: username +' left'
      });
      this.setState({
        users: users,
        messages: messages,
      });
  };

  _onSessionStart(session) {
    this.setState({
      session: session,
    }, function() {
      if (session && session.currentCard && session.chat) {
        this._onCardReceive(session.currentCard);
        this._onMessagesReceive(session.chat);
        this.updateTimer();

        if (this.timer) {
          clearInterval(this.timer);
        }

        this.timer = setInterval(function() {this.updateTimer()}.bind(this), 1000);
      }
    });
  };

  _onSessionEnd(sessionId) {
    this.setState({
      session: null,
      currentCard: null,
      timeLeft: [0,0],
    });

    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  _onCardReceive(card) {

    this.setState({
      currentCard: card,
    }, function() {
      this.setTextAreaHeight('standup-yesterday');
      this.setTextAreaHeight('standup-today');
      this.setTextAreaHeight('standup-obstacle');
    });

    console.log('i receive a card');
  }

  updateTimer() {
    if (this.state.session) {
      let diff = moment.duration(moment(this.state.session.sessionEndTime).diff(moment()));
      this.setState({
        timeLeft: [diff.minutes(), diff.seconds()],
      });
    }
  };

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
        socket.emit('join_lobby', this.props.owner + '/' + this.props.repo, team.id, function(teamId, session) {
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

    if (this.timer) {
      clearInterval(this.timer);
    }
    
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
    if (this.state.message.length === 0) return;

    let activeSession = this.state.session ? this.state.session.sessionId : null;

    socket.emit('send_message', this.props.owner + '/' + this.props.repo, this.state.selectedTeamId, this.state.message, activeSession);

    // push message right away without waiting for server response
    this._onMessageReceive({'username': this.state.me.login, 'message': this.state.message});

    this.setState({ message: '' });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleSendMessage();
    }
  };

  handleNavSelect = (teamId) => {
    // leave current lobby first
    socket.emit('leave_lobby', this.props.owner + '/' + this.props.repo, this.state.selectedTeamId, function(id) {

      if (this.timer) {
        clearInterval(this.timer);
      }

      window.history.pushState({}, "", "#Standup?id=" + teamId);

      this.setState({
        selectedTeamId: teamId,
        users: {},
        messages: [],
        message: '',
      }, function() {
        // join new lobby
        socket.emit('join_lobby', this.props.owner + '/' + this.props.repo, teamId, function(teamId, session) {
          this._onSessionStart(session);
        }.bind(this));
      });
    }.bind(this));

  };

  handleFindTeam() {
    changeLocationHash("#Team");
  };

  handleCardChange() {
    if (this.state.session) {
      socket.emit('card_modified', this.props.owner + '/' + this.props.repo, this.state.selectedTeamId, this.state.session.sessionId, this.state.currentCard);
    }
  };

  setTextAreaHeight(textAreaRef) {
      const standupCard = this.refs['standup-card'];
      const textArea = standupCard && standupCard.refs[textAreaRef];
      if (textArea) {
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';
      }
  };

  handleTextAreaChange(key, value, textAreaRef) {

    if (!this.state.session) {
      return;
    }

    let { currentCard } = this.state;

    currentCard[key] = value;

    this.setState({currentCard: currentCard}, function() {
      this.setTextAreaHeight(textAreaRef);
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
    socket.emit('start_session', this.props.owner + '/' + this.props.repo, this.state.selectedTeamId, function(session) {
      // if this is called then the session has already begun

    }.bind(this));
  };

  handleEndSession() {

    if (this.state.session) {
      socket.emit('end_session', this.props.owner + '/' + this.props.repo, this.state.selectedTeamId, this.state.session.sessionId, function(err) {
        console.log(err);
      }.bind(this));
    }
  };

  handleNextPerson(e) {
    e.preventDefault();

    if (this.state.session) {
      socket.emit('next_person', this.props.owner + '/' + this.props.repo, this.state.selectedTeamId, this.state.session.sessionId);
    }
  }

  isObjectEmpty(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  };

  render() {

    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        if (this.isObjectEmpty(this.state.users)) {
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
        let mePresenting;

        if (this.state.session && this.state.currentCard) {
          presentingUser = this.state.users[this.state.currentCard.username];

          if (!presentingUser) {
            return (<div></div>);
          }

          mePresenting = this.state.me.login === presentingUser.login;
        }

        return (
          <RepoContent>
            <Chat ref="chat" teamName={team.displayName} messages={this.state.messages} message={this.state.message} {...this} />
            <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
            {!this.state.session || !this.state.currentCard ?
            <WaitingRoom handleStartSession={this.handleStartSession} users={this.state.users}/> :
            <StandupBox>
              <h1>{this.state.timeLeft[0] + " mins " + this.state.timeLeft[1] + " seconds remaining"}</h1>
              <StandupProfile username={presentingUser && presentingUser.login} src={presentingUser && presentingUser['avatar_url']}/>
              <StandupCard ref="standup-card"
                presenting={mePresenting}
                card={this.state.currentCard}
                handleYesterdayChange={this.handleYesterdayChange}
                handleTodayChange={this.handleTodayChange}
                handleObstacleChange={this.handleObstacleChange} />
              <SpreadSectionButtonGroup>
                <DangerButton onClick={this.handleEndSession}>End Session</DangerButton>
                {mePresenting ? <PrimaryButton onClick={this.handleNextPerson}>Done</PrimaryButton> : <div></div>}
              </SpreadSectionButtonGroup>
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