
import backoff from 'backoff';

import pg from 'pg';

export default callback => {
	let expBackoff = backoff.exponential({
		randomisationFactor: 0.5
	});

	let config = {
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DATABASE,
		port: 5432,
		host: process.env.POSTGRES_HOST
	}

	let maxTries = 10;
	expBackoff.failAfter(maxTries);
	expBackoff.on('backoff', (num, delay) => {
		console.log(`Attempting to reconnect to postgres in ${delay}ms. (Try ${num + 1}/${maxTries})`);
	})
	expBackoff.on('ready', (num, delay) => {
		try {
			let dbClient = new pg.Client(config);

			dbClient.on('error', error => {
				if (error.code === 'ECONNREFUSED') {
					// do nothing, we'll try.
				} else {
					throw error;
				}
			});

			dbClient.connect(err => {
				if (err) {
					expBackoff.backoff();
				} else {
					console.log("Successfully connected to postgres.");
					callback(dbClient);
				}
			})
		} catch (e) {
			console.error(e);
			expBackoff.backoff();
		}
	})
	expBackoff.on('fail', () => {
		console.log("Failed to connect to postgres.");
	})

	expBackoff.backoff();
}
