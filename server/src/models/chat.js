
import Sequelize from 'sequelize';

import StandupSessions from './standupSessions'

export default ({ db }) => {
    let model = db.define('chat', {
        message: Sequelize.STRING
    })

    return model;
}