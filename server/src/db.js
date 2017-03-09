
import backoff from 'backoff';
import Sequelize from 'sequelize';

/**
 * Initializes oru database and returns the client upon successfully 
 * connecting to postgres. 
 * 
 * Utilizes exponential backoff to retry reconnections.
 * 
 */
export default callback => {

	let config = {
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DATABASE,
		port: 5432,
		host: process.env.POSTGRES_HOST
	}

	// Setup exponential backoff incase of postgres starting before the app server
	let expBackoff = backoff.exponential({
		randomisationFactor: 0.5
	});
	let maxTries = 10;

	expBackoff.failAfter(maxTries);
	expBackoff.on('backoff', (num, delay) => {
		console.log(`Attempting to reconnect to postgres in ${delay}ms. (Try ${num + 1}/${maxTries})`);
	})
	expBackoff.on('fail', () => {
		console.log("Failed to connect to postgres.");
	})
	expBackoff.on('ready', (num, delay) => {
		let sequelize = new Sequelize(config.database, config.user, config.password, {
			host: config.host,
			port: config.port,
			dialect: 'postgres'
		})

		sequelize.authenticate()
			.then(() => {
				console.log("Successfully connected to postgres.");
				callback(sequelize);
			})
			.catch(err => {
				console.log(err);
				expBackoff.backoff();
			});
	})

	expBackoff.backoff();
}
