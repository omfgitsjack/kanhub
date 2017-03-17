
import Sequelize from 'sequelize';

import StandupSessions from './standupSessions'

export default ({ db }) => {
    let model = db.define('standupCards', {
        currentDescription: Sequelize.STRING,
        roadblocksDescription: Sequelize.STRING,
        futureDescription: Sequelize.STRING
    })

    return model;
}