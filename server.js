
// Load Packages
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './routes';
import morgan from 'morgan';
import cors from 'cors';

// Connect DataBase
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error);
db.once('open', function() {
	console.log("Connected to DB");
});

mongoose.connect('mongodb://localhost:27017/normaltest');

// Express setting to server
var server = express();

// Configure server to use bodyParser
server.use(morgan('dev'));
server.use(bodyParser.json());

// Set secret key
server.set('jwt-secret', 'NormaltiC');

// Configure Port
var port = process.env.PORT || 3002;

// Configure routes
server.use('/api', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Max-Age', '3600');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	(req.method === 'OPTIONS') ? res.sendStatus(202) : next();

});
//server.use('/api', cors());
server.use('/api', router);

var Start = server.listen( port, function() {
	console.log("Server has started on port " + port);
});
