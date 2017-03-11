
import TeamModelFactory from '../models/teams';

export default ({ db }) => {

    let TeamModel = TeamModelFactory({ db });

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
        })
    }
}