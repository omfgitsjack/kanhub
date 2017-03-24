
import Sequelize from 'sequelize';

import Users from './users';
import Teams from './teams';
import StandupSessions from './standupSessions'
import StandupCards from './standupCards'
import Chat from './chat'

export default ({ db }) => {
    let user = Users({ db }),
        team = Teams({ db }),
        standupSessions = StandupSessions({ db }),
        standupCards = StandupCards({ db }),
        chat = Chat({ db });

    // user relations
    user.belongsToMany(team, { through: 'TeamList' });
    user.hasMany(standupCards, { foreignKey: 'username' });

    // team relations
    team.belongsToMany(user, { through: 'TeamList' });
    team.hasMany(standupSessions, { foreignKey: 'teamId' });

    // standupSessions relations
    standupSessions.belongsTo(team, { foreignKey: 'teamId' });
    standupSessions.hasMany(standupCards, { foreignKey: 'sessionId' });
    standupSessions.hasMany(chat, { foreignKey: 'sessionId' });

    // standupCards relations
    standupCards.belongsTo(standupSessions, { foreignKey: 'sessionId'});
    standupCards.belongsTo(user, { foreignKey: 'username' });

    // Chat relations
    chat.belongsTo(user, { foreignKey: 'username' });
    chat.belongsTo(team, { foreignKey: 'teamId' });
    chat.belongsTo(standupSessions, { foreignKey: 'sessionId' });

    db.sync();
}