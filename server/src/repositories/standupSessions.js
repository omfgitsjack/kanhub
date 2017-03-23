
import { NOW } from 'sequelize';
import moment from 'moment'

export default ({ db }) => {
    let SessionModel = db.models.standupSessions,
        SessionCardModel = db.models.standupCards

    return {
        create: teamId => new Promise(resolve => SessionModel
            .findOrCreate({
                where: { 
                    teamId,
                    sessionStartedAt: {
                        $gt: moment().subtract(15, 'minutes').toDate(),
                        $lt: moment().toDate()
                    },
                    sessionEndedAt: {
                        $eq: null
                    }
                },
                defaults: { teamId: teamId, sessionStartedAt: new Date(), sessionEndedAt: null }})
            .spread((session, created) => {
                resolve({ session, created });
            })),
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