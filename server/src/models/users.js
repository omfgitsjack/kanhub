
import Sequelize from 'sequelize';

export default ({ db }) => {
    let User = db.define('user', {
        displayName: Sequelize.STRING,
        username: {
            type: Sequelize.STRING, 
            allowNull: false, 
            primaryKey: true },
        profileUrl: Sequelize.STRING,
        token: Sequelize.STRING
    })

    return User;
}