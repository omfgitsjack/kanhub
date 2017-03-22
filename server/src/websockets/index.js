
import socket from 'socket.io';


export default ({ app, db }) => {
    let io = socket(app),
        standupIo = io.of('/auth/standup')
    
    // Given token lookup their name from db..
    let getUsername = token => "bobby"

    
    standupIo.on('connection', socket => {
        socket.emit('require_auth');

        socket.on('auth_request', token => {
            console.log("[socket-auth]:", token);
        });

        socket.on('join_lobby', ({ token, teamId }) => {

            if (!token) {
                socket.emit('join_lobby_fail', { reason: 'require_auth' });
            } else {
                socket.join('lobby/' + teamId)
                standupIo.to('lobby/' + teamId).emit('user_joined_lobby', getUsername(token))

                socket.emit('join_lobby_success');
                console.log("[join_team_standup_lobby]: ", teamId);
            }
        })
    })

}