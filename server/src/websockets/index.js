
import socket from 'socket.io';
import socketioJwt from 'socketio-jwt';

const getLobbyUrl = teamId => `lobby/${teamId}`;
const getUserUrl = username => `user/${username}`;

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

export default ({ app, db, redisClient }) => {
    let io = socket(app);

    let standupIo = io
        .of('/auth/standup')
        .use(socketioJwt.authorize({
            secret: 'koocat',
            handshake: true
        }));

    standupIo.on('connection', function (socket) {
        let username = socket.decoded_token.username;
        console.log('[Connection Established]', username);

        socket.on('join_lobby', function(teamId, cb) {
            const lobbyUrl = getLobbyUrl(teamId);

            socket.join(lobbyUrl); // add user to lobby
            saveUserToLobby(redisClient, lobbyUrl, username);
            getLobbyList(redisClient, lobbyUrl).then(users => socket.emit('join_lobby_success', users));

            standupIo.to(lobbyUrl).emit('user_joined_lobby', username); // Broadcast to everyone in lobby that user has joined
            
            if (cb) {
                cb(teamId);
            }

            console.log('[Joined Lobby]', username);
        });

        socket.on('leave_lobby', function(teamId, cb) {
            const lobbyUrl = getLobbyUrl(teamId);

            socket.leave(lobbyUrl);
            removeUserFromLobby(redisClient, lobbyUrl, username);
            standupIo.to(lobbyUrl).emit('user_left_lobby', username);

            if (cb) {
                cb(teamId);
            }

            console.log('[Left Lobby]', username, teamId);
        });

        socket.on('send_message', function(teamId, messageContent) {
            const lobbyUrl = getLobbyUrl(teamId);

            const message = {
                author: username,
                content: messageContent,
            };

            standupIo.to(lobbyUrl).emit('message_received', message);
        });

        socket.on('disconnect', socket => {
            getUserActiveLobbies(redisClient, username).then(lobbies => lobbies.forEach(lobby => {
                removeUserFromLobby(redisClient, lobby, username); // Remove the user from the lobby
                standupIo.to(lobby).emit('user_left_lobby', username); // broadcast to everyone that the user has left.
            }));

            console.log('[Disconnected]', username);
        });
    });
}