import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

import auth from './auth'
import user from './users'
import team from './teams'
import passport from 'passport';

const requireAuth = (req, res, next) => {
	console.log(req.session, 'session');
	if (req.session && req.session.user) {
		next()
	} else {
		// res.redirect('/api/auth/github');
		res.status(401).json({ success: false, code: 'USER_NOT_LOGGED_IN' });
	}
}

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	// api.use('/facets', facets({ config, db }));
	api.use('/auth', auth({ config, db, requireAuth }));
	api.use('/users', requireAuth, user({ config, db }));
	api.use('/repository/:repository/teams', requireAuth, team({ config, db }));

	api.get('/sessiontest', requireAuth, (req, res) => {
		res.json({
			success: true,
			session: req.session
		})
	})

	return api;
}