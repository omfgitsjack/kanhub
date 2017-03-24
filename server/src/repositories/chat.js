
import moment from 'moment'

export default ({ db }) => {
    let ChatModel = db.models.chat;

    return {
        create: ({ teamId, sessionId, username, message}) =>
            ChatModel.create({
                teamId, sessionId, username, message
            }),
        readAll: ({ sessionId, page = 0, pageSize = 20 }) =>
            ChatModel.findAndCountAll({
                where: { sessionId },
                limit: pageSize,
                offset: page * pageSize,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'message', 'username', 'sessionId', 'createdAt'],
            })
    }
}