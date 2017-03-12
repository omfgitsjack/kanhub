import http from 'http';
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


let app = express();
app.server = http.createServer(app);

import cookieParser from 'cookie-parser';
app.use(cookieParser());
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import session from 'express-session';
import passport from 'passport';
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit: config.bodyLimit
}));

import initModels from './models'

// connect to db
initializeDb(db => {

	initModels({ db })

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
