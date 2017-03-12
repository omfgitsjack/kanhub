
import Sequelize from 'sequelize';

import Users from './users'

export default ({ db }) => {
    let Team = db.define('team', {
        repository: { type: Sequelize.STRING, unique: 'compositeIndex' },
        displayName: { type: Sequelize.STRING, unique: 'compositeIndex' },
        description: Sequelize.STRING,
    })

    return Team;
}