var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Account = require('./routes/models/account');
var Schedule = require('./routes/models/schedule');
var Vote = require('./routes/models/vote');

var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error);
db.once('open', function() {
	console.log("Connected to DB Server");
});

mongoose.connect('mongodb://localhost:27017/normaltest');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001;

var router = require('./routes')(app, Account, Schedule, Vote);

var server = app.listen(port, function() {
	console.log("Cal Server has started on port " + port);
});
