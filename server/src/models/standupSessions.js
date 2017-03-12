
import Sequelize from 'sequelize';

import Teams from './teams'

export default ({ db }) => {
    let model = db.define('standupSessions', {
        sessionStartedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        sessionEndedAt: { type: Sequelize.DATE, defaultValue: null },
    })

    return model;
} 