
import { Router } from 'express';

import TeamRepositoryFactory from '../repositories/teams';
import * as websocket from '../websockets';

import standupRoutes from './standups'

export default ({ config, db }) => {

    let api = Router({ mergeParams: true }),
        TeamRepository = TeamRepositoryFactory({ db })

    // TODO: validation & permissions
    api.post('/', (req, res) => {
        TeamRepository.create({
            repository: req.params.repository,
            displayName: req.body.displayName,
            description: req.body.description,
        }).then(({ team, created }) => {
            if (!created) {
                res.status(400).json({
                    success: false,
                    code: 'TEAM_ALREADY_EXISTS'
                })
            } else {
                res.json(team)
            }
        });
    });

    // TODO: pagination
    api.get('/', (req, res) => {
        TeamRepository.getTeamsInRepository(req.params.repository).then(teams => {
            res.json(teams)
        })
    });

    // TODO: validation & permissions
    api.put('/:teamId', (req, res) => {
        let body = req.body;

        TeamRepository.edit(req.params.teamId, req.body).then(([affectedCount]) => {
            
            if (affectedCount === 0) {
                res.status(400).json({ success: false, code: 'TEAM_DOES_NOT_EXIST' })
            } else if (affectedCount === 1) {
                res.json();
            } else {
                throw "Somehow matched more than one item..."
            }
        })
    });

    api.delete('/:teamId', (req, res) => {
        TeamRepository.remove(req.params.teamId).then(deletedCount => {
            if (deletedCount === 0) {
                res.status(400).json({ success: false, code: 'TEAM_DOES_NOT_EXIST'})
            } else if (deletedCount === 1) {
                res.json()
            } else {
                throw "Somehow matched more than one item..."
            }
        })
    })

    let fetchTeam = (showMetadata = true) => (req, res) => {
        TeamRepository.getTeamMembers(req.params.teamId).then(team => {
            if (showMetadata) {
                res.json(team);
            } else {
                res.json(team.users);
            }
        })
    }

    api.get('/:teamId', fetchTeam(true));
    api.get('/:teamId/members', fetchTeam(false));

    // TODO: Add validation here.
    api.post('/:teamId/members', (req, res) => {
        let username = req.body.username

        TeamRepository.addTeamMember(req.params.teamId, username).then(() => {
            res.json();
        }).catch(err => {
            res.status(400).json({ success: false, code: "INTERNAL_ERROR" })
        })
    })

    api.use('/:teamId/standups', standupRoutes({ config, db }));


    return api
}