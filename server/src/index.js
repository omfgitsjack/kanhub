import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Load in env variables
import dotenv from 'dotenv';
dotenv.config();

import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

// Create https server
let options = {
	key: fs.readFileSync(process.env.SSL_KEY),
	cert: fs.readFileSync(process.env.SSL_CERT)
};

let app = express();
app.server = https.createServer(options, app);

import cookieParser from 'cookie-parser';
app.use(cookieParser());
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import session from 'express-session';
import passport from 'passport';
app.use(session({ 
	secret: 'brandon was here',
	cookie: { secure: true, sameSite: false }, // TODO: toggle to true and access cookie from background page }
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders,
	credentials: true,
	origin: /^chrome-extension:\/\/*/
}));

app.use(bodyParser.json({
	limit: config.bodyLimit
}));

import initModels from './models'
import initSocket from './websockets'

import redisFactory from './redis';

// connect to db
initializeDb(db => {

	initModels({ db })

	// internal middleware
	app.use(middleware({ config, db }));

	app.use((req, res, next) => {
		console.log();
		
		next()
	})

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port);

	let client = redisFactory();
	
	initSocket({ app: app.server, db, redisClient: client });

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
