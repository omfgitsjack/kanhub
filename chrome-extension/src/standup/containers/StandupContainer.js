import React, { Component } from 'react';
import { NotInTeam, WaitingRoom, StandupBox, StandupProfile } from '../components/components';
import Chat from '../components/Chat';
import StandupCard from '../components/StandupCard';
import { NoTeamFound, NoPresenter, TeamSubNav } from '../../team/components/components';
import { SpreadSectionButtonGroup, NormalButton, DangerButton, PrimaryButton, RepoContent, NavHeader } from '../../github_elements/elements';
import { changeLocationHash } from '../../pageHelper';
import { createSocket } from '../../socketCommon';
import * as model from '../model/model';
import { playMusicFromStream } from '../../modelCommon';
import moment from 'moment';
import _ from 'lodash';
import { Map, List } from 'immutable';

import Peer from 'peerjs';

let socket;

class StandupContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTeamId: parseInt(props.query.id) || (this.props.teams.length > 0 && this.props.teams[0].id),
      users: Map(),
      messages: List(),
      message: '',
      yesterdayDescription: '',
      todayDescription: '',
      obstaclesDescription: '',
      currentCard: null,
      session: null,
      me: props.user,
      timeLeft: [0, 0],
    };

    this.timer = null;
    this.uniqueId = props.owner + '/' + props.repo;

    this.handleYesterdayChange = this.handleYesterdayChange.bind(this);
    this.handleTodayChange = this.handleTodayChange.bind(this);
    this.handleObstacleChange = this.handleObstacleChange.bind(this);
    this.handleStartSession = this.handleStartSession.bind(this);
    this.handleEndSession = this.handleEndSession.bind(this);
    this.handleNextPerson = this.handleNextPerson.bind(this);
    this.handleIssueSelect = this.handleIssueSelect.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
  };

  _onJoinSuccess(lobbyUsers) {
    model.getAllUserInfo({ users: lobbyUsers }).then(function (users) {
      var usersMap = users.reduce(function (map, user) {
        map[user.login] = user;
        return map;
      }, {});

      this.setState({
        users: Map(usersMap),
      });

    }.bind(this));
  };

  _onMessageReceive(message) {

    let messages = this.state.messages.push(message);

    this.setState({
      messages: messages,
    }, function () {
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

    const messages = _.map(sessionMessages.reverse(), function (message) {
      return { username: message.username, message: message.message };
    });

    this.setState({
      messages: List(messages),
    }, function () {
      const chatContainer = this.refs['chat'];
      if (chatContainer) {
        const messageContainer = chatContainer.refs['chat-container'];
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      }
    });
  };

  _onUserJoin(username, cb) {

    let messages = this.state.messages.push({
      username: 'KANHUB_BOT',
      message: username + ' joined'
    });

    let users = this.state.users;

    if (!users.get(username)) {
      model.getUserInfo({ username: username }).then(function (user) {
        users = users.set(username, user);

        this.setState({
          users: users,
          messages: messages,
        }, function () {
          if (cb) {
            cb();
          }
        });
      }.bind(this));
    } else {
      this.setState({
        messages: messages,
      }, function () {
        if (cb) {
          cb();
        }
      });
    }
  };

  _onUserLeave(username, cb) {
    let users = this.state.users.set(username, null);
    let messages = this.state.messages.push({
      username: 'KANHUB_BOT',
      message: username + ' left'
    });
    this.setState({
      users: users,
      messages: messages,
    }, function () {
      if (cb) {
        cb();
      }
    });
  };

  _onSessionStart(session) {
    this.setState({
      session: session,
    }, function () {
      if (session && session.currentCard && session.chat) {
        this._onCardReceive(session.currentCard);
        this._onMessagesReceive(session.chat);
        this.updateTimer();

        if (this.timer) {
          clearInterval(this.timer);
        }

        this.timer = setInterval(function () { this.updateTimer() }.bind(this), 1000);
      }
    });
  };

  _onSessionEnd(sessionId) {
    if (!this.state.session || (this.state.session.sessionId !== sessionId.sessionId)) {
      return;
    }

    this.setState({
      session: null,
      currentCard: null,
      timeLeft: [0, 0],
    });

    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  _onCardReceive(card) {

    this.setState({
      currentCard: card,
    }, function () {
      this.setTextAreaHeight('standup-yesterday');
      this.setTextAreaHeight('standup-today');
      this.setTextAreaHeight('standup-obstacle');
    });
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
      window.history.pushState({}, "", "#Standup?id=" + this.state.selectedTeamId);

      socket = createSocket(this.props.socketToken);

      socket.on('connect', function () {
        // We want to join the peer2peer voice chat too.
        let peer = new Peer(this.props.user.login, { host: process.env.REACT_APP_HOST, port: 9000, path: '/', secure: true });
        let otherUser = this.props.user.login === 'omfgitsjack' ? 'omfgtsalex' : 'omfgitsjack';
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContext();

        peer.on('open', function (id) {
          console.log('My peer ID is: ' + id);


          if (otherUser === 'omfgtsalex') {
            var conn = peer.connect(otherUser);
            conn.on('error', err => {
              console.log("failed to connect to alex");
            })
            conn.on('open', function () {
              console.log('sending hi to ', otherUser);
              conn.send('hi!');
            });

            // var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
              var call = peer.call(otherUser, stream);
              call.on('stream', function (remoteStream) {
                // Show stream in some video/canvas element.
                console.log('getting something back..');

                var mediaStreamSource = audioContext.createMediaStreamSource(remoteStream);
                mediaStreamSource.connect(audioContext.destination);
              });
              call.on('error', err => console.log(err));
            }, function (err) {
              console.log('Failed to get local stream', err);
            });
          } else {
            peer.on('connection', function (conn) {
              conn.on('data', function (data) {
                // Will print 'hi!'
                console.log(data, 'from ', otherUser);
              });
            });

            // var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            peer.on('call', function (call) {
              navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', function (remoteStream) {
                  // Show stream in some video/canvas element.
                var mediaStreamSource = audioContext.createMediaStreamSource(remoteStream);
                mediaStreamSource.connect(audioContext.destination);

                });
              }, function (err) {
                console.log('Failed to get local stream', err);
              });
            });
          }

        });

        socket.emit('join_lobby', this.uniqueId, team.id, function (teamId, session) {
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
      socket.emit('leave_lobby', this.uniqueId, this.state.selectedTeamId);
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

    socket.emit('send_message', this.uniqueId, this.state.selectedTeamId, this.state.message, activeSession);

    // push message right away without waiting for server response
    this._onMessageReceive({ 'username': this.state.me.login, 'message': this.state.message });

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
    socket.emit('leave_lobby', this.uniqueId, this.state.selectedTeamId, function (id) {

      if (this.timer) {
        clearInterval(this.timer);
      }

      window.history.pushState({}, "", "#Standup?id=" + teamId);

      this.setState({
        selectedTeamId: teamId,
        users: Map(),
        messages: List(),
        message: '',
        yesterdayDescription: '',
        todayDescription: '',
        obstaclesDescription: '',
        currentCard: null,
        session: null,
        timeLeft: [0, 0],
      }, function () {
        // join new lobby
        socket.emit('join_lobby', this.uniqueId, teamId, function (teamId, session) {
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
      socket.emit('card_modified', this.uniqueId, this.state.selectedTeamId, this.state.session.sessionId, this.state.currentCard);
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

    this.setState({ currentCard: currentCard }, function () {
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
    socket.emit('start_session', this.uniqueId, this.state.selectedTeamId, function (session) {
      // if this is called then the session has already begun

    }.bind(this));
  };

  handleEndSession() {

    if (this.state.session) {
      socket.emit('end_session', this.uniqueId, this.state.selectedTeamId, this.state.session.sessionId, function (err) {
        console.log(err);
      }.bind(this));
    }
  };

  handleNextPerson(e) {
    e.preventDefault();

    if (this.state.session) {
      socket.emit('next_person', this.uniqueId, this.state.selectedTeamId, this.state.session.sessionId);
    }
  };

  handleIssueSelect(issueNumber) {
    this.props.showIssueModal(this.props.repo, this.props.owner, issueNumber.substring(1));
  };

  handleIssueModalClose() {

    this.setState({
      isIssueModalOpen: false,
    });
  }

  render() {
    if (this.props.teams) {
      if (this.props.teams.length > 0) {

        const team = this.props.teams.find(function (team) {
          return team.id === this.state.selectedTeamId;
        }.bind(this));

        if (!team) {
          return (
            <NoTeamFound />
          );
        }

        const userListSize = this.state.users.size;

        let presentingUser;
        let mePresenting;

        if (this.state.session && this.state.currentCard && userListSize > 0) {
          presentingUser = this.state.users.get(this.state.currentCard.username);

          if (presentingUser) {
            mePresenting = this.state.me.login === presentingUser.login;
          }
        }

        return (
          <RepoContent>
            <audio src="" ref='audio'></audio>
            <Chat ref="chat" me={this.state.me}
              presentingUser={presentingUser}
              teamName={team.displayName}
              messages={this.state.messages}
              message={this.state.message}
              handleMessageChange={this.handleMessageChange}
              handleSendMessage={this.handleSendMessage}
              handleKeyPress={this.handleKeyPress}
              handleIssueSelect={this.handleIssueSelect} />
            <NavHeader>
              <TeamSubNav teams={this.props.teams} selectedTeamId={this.state.selectedTeamId} handleNavSelect={this.handleNavSelect} />
            </NavHeader>
            {!this.state.session || !this.state.currentCard || userListSize == 0 ?
              <WaitingRoom handleStartSession={this.handleStartSession} users={this.state.users} /> :
              presentingUser ?
                <StandupBox>
                  <h1>{this.state.timeLeft[0] + " mins " + this.state.timeLeft[1] + " seconds remaining"}</h1>
                  <StandupProfile username={presentingUser && presentingUser.login} src={presentingUser && presentingUser['avatar_url']} />
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
                </StandupBox> :
                <NoPresenter handleNextPerson={this.handleNextPerson} timeLeft={this.state.timeLeft[0] + " mins " + this.state.timeLeft[1] + " seconds remaining"}></NoPresenter>}
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