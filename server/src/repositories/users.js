
export default ({ db }) => {
    let UserModel = db.models.user,
        TeamModel = db.models.team;

    return {
        findOrCreate: (payload) => new Promise(resolve => {
            UserModel
                .findOrCreate({
                    where: { username: payload.username },
                    defaults: payload
                })
                .spread((user, created) => {
                    resolve({ user, created })
                })
        }),
        findById: username => UserModel.findById(username, {
            include: [
                { model: TeamModel, attributes: ['id', 'repository', 'displayName', 'description']}
            ]
        })
    }
}