
const getSessionQueue = sessionId => `queue/${sessionId}`
const getLobbyUrl = teamId => `lobby/${teamId}`;
const getStartTime = sessionId => `startTime/${sessionId}`;

import moment from 'moment'

export default (redis, io, teamId, sessionId) => {
    let room = io.to(getLobbyUrl(teamId))

    let api = {
        sessionStart: time => redis.setAsync(getStartTime(sessionId), time),
        sessionEnd: (sessionsRepo, cb) => 
            sessionsRepo.read(sessionId)
                .then(session => {
                    if (!session) {
                        return Promise.reject("session does not exist.");
                    } else if (session.sessionEndedAt) {
                        return Promise.reject("session has already ended.");
                    } else {
                        return Promise.resolve()
                    }
                })
                .then(() => sessionsRepo.endSession(sessionId)) // write to db
                .then(() => redis.del(getStartTime(sessionId))) // clear start time.
                .then(() => {
                    console.log("[Session Ended]", sessionId);
                    
                    room.to(getLobbyUrl(teamId)).emit('session_ended', {
                        sessionId: sessionId
                    })
                })
                .catch(reason => cb(reason)),
        getSessionDetails: (chatRepo) => {
            return Promise.all([
                api.getCurrentPerson(),
                api.getCurrentCard(),
                redis.getAsync(getStartTime(sessionId)),
                chatRepo.readAll({ sessionId, pageSize: 1000000 })
            ]).then(([ username, card, startingTime, { rows, count } ]) => {
                return {
                    sessionId,
                    sessionStartTime: moment(new Date(startingTime)),
                    sessionEndTime: moment(new Date(startingTime)).add(15, 'minutes'),
                    currentUser: username,
                    currentCard: card,
                    chat: rows.map(row => row.get({ plain: true }))
                }
            })
        },
        
        setCurrentPerson: username => redis.setAsync(sessionId + '/currentUser', username),
        getCurrentPerson: () => redis.getAsync(sessionId + '/currentUser'),
        setNewCurrentFromQueue: (emitEvent = true) =>
            redis.lpopAsync(getSessionQueue(sessionId))
                .then(user => {
                    console.log("[current_person]", user);
                    api.setCurrentPerson(user);
                    if (emitEvent) room.emit('current_person', user);

                    return user;
                })
                .catch(() => room.emit('current_person', null)),
        updateCurrentCard: (cardId, payload) => 
            redis.setAsync(sessionId + '/currentCard', JSON.stringify(Object.assign({}, payload, { id: cardId }))),
        getCurrentCard: () => redis.getAsync(sessionId + '/currentCard').then(payload => JSON.parse(payload)),

        pushUsersIntoQueue: users => redis.rpushAsync(getSessionQueue(sessionId), users)
    }

    return api;
}

// Known issues: if a user disconnects, 