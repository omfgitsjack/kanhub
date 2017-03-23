import io from 'socket.io-client'

const SERVER_ROUTE = process.env.REACT_APP_SERVER_ROUTE;

export function createSocket(token) {
    return io.connect(SERVER_ROUTE + '/auth/standup', {
      'query': 'token=' + token
    });
};