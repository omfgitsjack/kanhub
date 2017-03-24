
import Sequelize from 'sequelize';

import Users from './users';
import Teams from './teams';
import StandupSessions from './standupSessions'
import StandupCards from './standupCards'

export default ({ db }) => {
    let user = Users({ db }),
        team = Teams({ db }),
        standupSessions = StandupSessions({ db }),
        standupCards = StandupCards({ db });

    // user relations
    user.belongsToMany(team, { through: 'TeamList' });
    user.hasMany(standupCards, { foreignKey: 'username' });

    // team relations
    team.belongsToMany(user, { through: 'TeamList' });
    team.hasMany(standupSessions, { foreignKey: 'teamId' });

    // standupSessions relations
    standupSessions.belongsTo(team, { foreignKey: 'teamId' })
    standupSessions.hasMany(standupCards, { foreignKey: 'sessionId' });

    // standupCards relations
    standupCards.belongsTo(standupSessions, { foreignKey: 'sessionId'});
    standupCards.belongsTo(user, { foreignKey: 'username' });

    db.sync();
}