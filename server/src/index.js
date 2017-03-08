import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// Load in env variables
import dotenv from 'dotenv';
dotenv.config();

import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

// Setup authentication
import passport from 'passport';
import GithubStrategy from 'passport-github2';
passport.use(new GithubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: `${process.env.SERVER_ROUTE}/api/auth/github/callback`
},
(accessToken, refreshToken, profile, done) => {
	console.log("verified:", accessToken, refreshToken, profile);
	done();
}));

console.log('postgres user: ', process.env.PGUSER);
console.log('postgres password: ', process.env.PGPASSWORD);
console.log('postgres database: ', process.env.PGDATABASE);
console.log('postgres host: ', process.env.PGHOST);

// Setup postgres
import pg from 'pg';
let dbClient = new pg.Client({
	user: process.env.PGUSER,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: 5432,
	host: process.env.PGHOST
});
dbClient.connect(err => {
	if (err) throw err;

	console.log("successfully connected to db!");
})

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
