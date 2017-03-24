
export default ({ db }) => {
    let TeamModel = db.models.team,
        UserModel = db.models.user;

    return {
        create: ({ repository, displayName, description }) => new Promise(resolve => {
            TeamModel
                .findOrCreate({
                    where: { repository, displayName },
                    defaults: {
                        repository, displayName, description
                    }
                })
                .spread((team, created) => {
                    resolve({ team, created })
                })
        }),
        getTeamsInRepository: repository =>
            TeamModel
                .findAll({
                    where: { repository },
                    attributes: ['id', 'repository', 'displayName', 'description']
                }),
        remove: id => TeamModel.destroy({
            where: { id }
        }),
        edit: (id, payload) => TeamModel.update(payload, {
            where: { id },
            fields: ['displayName', 'description']
        }),

        // Managing team members
        getTeamMembers: teamId =>
            TeamModel.findById(teamId, {
                include: [
                    { model: UserModel, attributes: ['displayName', 'username', 'profileUrl'] }
                ]
            }),
        addTeamMember: (teamId, userId) => 
            Promise.all([
                TeamModel.findById(teamId),
                UserModel.findById(userId)
            ]).then(([ team, user ]) => team.addUser(userId)),
        removeTeamMember: (teamId, userId) => TeamModel.findById(teamId).then(team => team.removeUser(userId))
    }
}