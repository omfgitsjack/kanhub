
import { Router } from 'express';

import StandupSessionsRepositoryFactory from '../repositories/standupSessions';

export default ({ config, db }) => {

    let api = Router({ mergeParams: true }),
        sessionsRepo = StandupSessionsRepositoryFactory({ db })

    api.get('/', (req, res) => {
        let {
            page = 0,
            pageSize = 10
        } = req.query
        
        sessionsRepo.readAll({ teamId: req.params.teamId, page, pageSize})
            .then(({ rows, count }) => {
                res.json({
                    data: rows,
                    count
                })
            })
    })
    // TODO: validate that data has been passed in.
    api.post('/', (req, res) => 
        sessionsRepo.create(req.params.teamId).then(session => res.json(session)))
    api.get('/:standupId', (req, res) => 
        sessionsRepo.read(req.params.standupId).then(session => res.json(session)))
    api.put('/:standupId', (req, res) =>
        sessionsRepo.endSession(req.params.standupId).then(([affectedCount]) => {
            if (affectedCount === 0) {
                res.status(400).json({ success: false, code: 'STANDUP_ID_DOES_NOT_EXIST' })
            } else if (affectedCount === 1) {
                res.json();
            } else {
                throw "Somehow matched more than one item..."
            }
        }))
    api.delete('/:standupId', (req, res) =>
        sessionsRepo.remove(req.params.standupId).then(deletedCount => {
            if (deletedCount === 0) {
                res.status(400).json({ success: false, code: 'STANDUP_ID_DOES_NOT_EXIST'})
            } else if (deletedCount === 1) {
                res.json()
            } else {
                throw "Somehow matched more than one item..."
            }
        }))

    return api
}


