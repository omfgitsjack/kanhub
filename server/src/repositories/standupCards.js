
export default ({ db }) => {
    let SessionModel = db.models.standupSessions,
        SessionCardModel = db.models.standupCards

    return {
        create: (sessionId, username) => new Promise(resolve => {
            SessionCardModel
                .findOrCreate({
                    where: { sessionId, username },
                    defaults: { sessionId, username }
                })
                .spread((card, created) => {
                    resolve({ card, created })
                })
        }),
        readAllFromSession: ({ sessionId, page = 0, pageSize = 10 }) =>
            SessionCardModel.findAndCountAll({
                where: { sessionId },
                limit: pageSize,
                offset: page * pageSize
            }),
        edit: (cardId, payload) =>
            SessionCardModel.update(payload, {
                where: { id: cardId },
                fields: ['yesterdayDescription', 'todayDescription', 'obstaclesDescription']
            })
    }
}