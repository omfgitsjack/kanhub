
import Sequelize from 'sequelize';

export default ({ db }) => {
    let Team = db.define('team', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        repository: { type: Sequelize.STRING, unique: 'compositeIndex' },
        displayName: { type: Sequelize.STRING, unique: 'compositeIndex' },
        description: Sequelize.STRING,
    })

    return Team;
}