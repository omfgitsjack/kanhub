
import Sequelize from 'sequelize';

export default ({ db }) => {
    let Team = db.define('team', {
        repository: { type: Sequelize.STRING, unique: 'compositeIndex' },
        displayName: { type: Sequelize.STRING, unique: 'compositeIndex' },
        description: Sequelize.STRING,
        label: Sequelize.STRING,
    })

    return Team;
}