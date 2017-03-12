
import { NOW } from 'sequelize';

export default ({ db }) => {
    let SessionModel = db.models.standupSessions,
        SessionCardModel = db.models.standupCards

    return {
        create: teamId =>
            SessionModel.create({ teamId, sessionStartedAt: new Date() }, {
                fields: ['teamId', 'sessionStartedAt']
            }),
        /**
         * Returns { rows: [...], count: int }, with the most recently ended sessions
         * shown first.
         */
        readAll: ({ teamId, page = 0, pageSize = 10 }) =>
            SessionModel.findAndCountAll({
                where: { teamId },
                limit: pageSize,
                offset: page * pageSize,
                order: [['sessionEndedAt', 'DESC']], // grab latest
                attributes: ['id', 'teamId', 'sessionEndedAt', 'sessionStartedAt'],
            }),
        read: sessionId =>
            SessionModel.findById(sessionId, {
                attributes: ['id', 'teamId', 'sessionEndedAt', 'sessionStartedAt'],
                include: [
                    { model: SessionCardModel } // eagerly fetch the cards.
                ]
            }),
        remove: sessionId => SessionModel.destroy({
            where: { id: sessionId }
        }),
        // Todo: Ensure that they cannot change the end date.
        endSession: sessionId => SessionModel.update({ sessionEndedAt: new Date() }, {
            where: { id: sessionId }
        })
    }
}