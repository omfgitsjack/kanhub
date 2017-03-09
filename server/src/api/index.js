import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

import auth from './auth'
import user from './users'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.use('/facets', facets({ config, db }));
	api.use('/auth', auth({ config, db }));
	api.use('/users', user({ config, db }));

	return api;
}