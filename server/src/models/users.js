
import Sequelize from 'sequelize';

import Teams from './teams'

export default ({ db }) => {
    let User = db.define('user', {
        displayName: Sequelize.STRING,
        username: {
            type: Sequelize.STRING, 
            allowNull: false, 
            primaryKey: true },
        profileUrl: Sequelize.STRING,
        token: Sequelize.STRING // Tokens might expire... so its nullable
    })

    return User;
}