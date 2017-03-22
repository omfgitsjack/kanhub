
import Sequelize from 'sequelize';

import StandupSessions from './standupSessions'

export default ({ db }) => {
    let model = db.define('standupCards', {
        yesterdayDescription: Sequelize.STRING,
        todayDescription: Sequelize.STRING,
        obstaclesDescription: Sequelize.STRING
    })

    return model;
}