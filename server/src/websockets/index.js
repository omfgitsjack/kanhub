
import socket from 'socket.io';
import socketioJwt from 'socketio-jwt';

import standupSessionsFactory from '../repositories/standupSessions';
import standupCardsFactory from '../repositories/standupCards';
import chatFactory from '../repositories/chat';

import moment from 'moment'

const getLobbyUrl = teamId => `lobby/${teamId}`;
const getUserUrl = username => `user/${username}`;
const getSessionQueue = sessionId => `queue/${sessionId}`

const saveUserToLobby = (client, lobby, username) => {
    client.hset(lobby, username, true);
    client.hset(getUserUrl(username), lobby, true);
};
const removeUserFromLobby = (client, lobby, username) => {
    client.hdel(lobby, username);
    client.hdel(getUserUrl(username), lobby);
};
const getLobbyList = (client, lobby) => client.hkeysAsync(lobby);
const getUserActiveLobbies = (client, user) => client.hkeysAsync(getUserUrl(user));

import sessionActions from './standupSessionActions';

export default ({ app, db, redisClient }) => {
    let sessionsRepo = standupSessionsFactory({ db }),
        sessionsCard = standupCardsFactory({ db }),
        chatRepo = chatFactory({ db }),
        io = socket(app);

    let standupIo = io
        .of('/auth/standup')
        .use(socketioJwt.authorize({
            secret: 'koocat',
            handshake: true
        }));

    standupIo.on('connection', function (socket) {
        let username = socket.decoded_token.username;
        console.log('[Connection Established]', username);

        socket.on('join_lobby', function (teamId, cb) {
            const lobbyUrl = getLobbyUrl(teamId);

            socket.join(lobbyUrl); // add user to lobby
            saveUserToLobby(redisClient, lobbyUrl, username);
            getLobbyList(redisClient, lobbyUrl).then(users => socket.emit('join_lobby_success', users));

            standupIo.to(lobbyUrl).emit('user_joined_lobby', username); // Broadcast to everyone in lobby that user has joined

            if (cb) {
                sessionsRepo.findActiveSession(teamId).then(val => {
                    if (!val) {
                        cb(teamId)
                    } else {
                        let session = val.get({ plain: true });
                        let actions = sessionActions(redisClient, standupIo, teamId, session.id);

                        actions.getSessionDetails(chatRepo).then(details => cb(teamId, details))

                        console.log(val.get({ plain: true }), 'found active session!');
                    }
                })
            }

            console.log('[Joined Lobby]', username);
        });

        socket.on('leave_lobby', function (teamId, cb) {
            const lobbyUrl = getLobbyUrl(teamId);

            socket.leave(lobbyUrl);
            removeUserFromLobby(redisClient, lobbyUrl, username);
            standupIo.to(lobbyUrl).emit('user_left_lobby', username);

            if (cb) {
                cb(teamId);
            }

            console.log('[Left Lobby]', username, teamId);
        });

        /**
         * cb called if there's a problem.
         */
        socket.on('start_session', (teamId, cb) => {
            sessionsRepo.create(teamId).then(({ session, created }) => {
                let actions = sessionActions(redisClient, standupIo, teamId, session.id);
                if (!created) { // session already exists
                    actions.getSessionDetails(chatRepo).then(details => cb(details));
                } else { // just started a new session.
                    getLobbyList(redisClient, getLobbyUrl(teamId)).then(users => {
                        console.log('Initializing queue w/ ', users);
                        let time = new Date()

                        actions.sessionStart(time)
                            // End the session in 15 minutes.
                            .then(() => setTimeout(() => actions.sessionEnd(sessionsRepo, () => { }), 15 * 60 * 1000))
                            .then(() => actions.pushUsersIntoQueue(users))
                            .then(() => actions.setNewCurrentFromQueue(false))
                            .then(nextUser => sessionsCard.create(session.id, nextUser))
                            .then(({ card, created }) => actions.updateCurrentCard(card.id, card).then(() => card))
                            .then(() => actions.getSessionDetails(chatRepo))
                            .then(details => standupIo.to(getLobbyUrl(teamId)).emit('session_started', details))
                    })
                }
            })
        })
        socket.on('end_session', (teamId, sessionId, cb) => {
            let actions = sessionActions(redisClient, standupIo, teamId, sessionId);

            actions.getCurrentCard().then(card => sessionsCard.edit(card.id, card))

            actions.sessionEnd(sessionsRepo, cb);
        })

        // Should add guards & checks.
        socket.on('card_modified', (teamId, sessionId, payload) => {
            let actions = sessionActions(redisClient, standupIo, teamId, sessionId)

            actions.updateCurrentCard(payload.id, payload)
                .then(() => {
                    socket.broadcast.emit('current_card', payload);
                })
        })
        // socket.on('card_save') // commit to postgres, mark current guy as done, pop next guy from queue & let everyone know.

        socket.on('next_person', (teamId, sessionId) => {
            let actions = sessionActions(redisClient, standupIo, teamId, sessionId)

            // Save current user's card
            actions.getCurrentCard()
                .then(card => sessionsCard.edit(card.id, card))
                .then(actions.setNewCurrentFromQueue)
                .then(nextUser => sessionsCard.create(sessionId, nextUser))
                .then(({ card, created }) => actions.updateCurrentCard(card.id, card).then(() => card))
                .then(card => {
                    if (card.username) {
                        standupIo.emit('current_card', card);
                    } else {
                        actions.sessionEnd(sessionsRepo, ()=>{});
                    }
                })
        });

        // Say a person disconnected & they're in the queue, we need to remove them.

        // socket.on('typing_message')
        // socket.on('new_message')
        socket.on('send_message', function (teamId, messageContent, sessionId=false) {
            const lobbyUrl = getLobbyUrl(teamId);

            chatRepo.create({ 
                teamId, 
                username, 
                message: messageContent, 
                sessionId: sessionId ? sessionId : null })

            const message = {
                username: username,
                message: messageContent,
            };

            socket.broadcast.to(lobbyUrl).emit('message_received', message);
        });

        socket.on('disconnect', socket => {
            getUserActiveLobbies(redisClient, username).then(lobbies => lobbies.forEach(lobby => {
                console.log();
                removeUserFromLobby(redisClient, lobby, username); // Remove the user from the lobby
                standupIo.to(lobby).emit('user_left_lobby', username); // broadcast to everyone that the user has left.
            }));

            console.log('[Disconnected]', username);
        });
    });
}