
import { Router } from 'express';

import UserRepositoryFactory from '../repositories/users';

export default ({ config, db }) => {

    let api = Router(),
        UserRepository = UserRepositoryFactory({ db })

    api.get('/:username', (req, res) => {
        let username = req.params.username;

        UserRepository.findById(username).then(user => {
            if (!user) {
                res.status(404).json({
                    success: false,
                    code: 'USER_NOT_FOUND'
                })
            } else {
                res.json({
                    success: true,
                    user: user
                });
            }
        });

    });

    return api
}