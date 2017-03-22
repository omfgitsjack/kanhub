
import socket from 'socket.io';
import socketioJwt from 'socketio-jwt';


export default ({ app, db }) => {
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

        socket.on('join_lobby', teamId => {
            // Join the lobby
            socket.join('lobby/' + teamId)

            // Broadcast to everyone in lobby that user has joined
            standupIo.to('lobby/' + teamId).emit('user_joined_lobby', username)

            socket.emit('join_lobby_success');

            console.log('[Joined Lobby]', username);
        })
    })


    // io.use(socketioJwt.authorize({
    //     secret: "koocat",
    //     handshake: true
    // }))


    // // Given token lookup their name from db..
    // let getUsername = token => "bobby"


    // standupIo.on('connection', socket => {
    //     console.log(socket.decoded_token, 'connected');
    // socket.emit('require_auth');

    // socket.on('auth_request', token => {
    //     console.log("[socket-auth]:", token);
    // });

    // socket.on('join_lobby', ({ token, teamId }) => {

    //     if (!token) {
    //         socket.emit('join_lobby_fail', { reason: 'require_auth' });
    //     } else {
    //         socket.join('lobby/' + teamId)
    //         standupIo.to('lobby/' + teamId).emit('user_joined_lobby', getUsername(token))

    //         socket.emit('join_lobby_success');
    //         console.log("[join_team_standup_lobby]: ", teamId);
    //     }
    // })
    // })

}