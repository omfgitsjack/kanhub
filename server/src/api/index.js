import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

import passport from 'passport'

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/auth/github', passport.authenticate('github', { scope: ['repo'] }));
	api.get('/auth/github/callback',
		passport.authenticate('github', { failureRedirect: '/login' }),
		function (req, res) {
			// Successful authentication, redirect home.
			console.log("Successful auth");
			res.redirect('/');
		});

	return api;
}