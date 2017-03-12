
import Sequelize from 'sequelize';

import Users from './users';
import Teams from './teams';

export default ({ db }) => {
    // Define them
    let user = Users({ db }),
        team = Teams({ db })

    user.belongsToMany(team, { through: 'TeamList' })
    team.belongsToMany(user, { through: 'TeamList' })

    db.sync();
}