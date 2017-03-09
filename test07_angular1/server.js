// server.js

// set up ========================
var kue = require('kue');

var express = require('express');

// create our app w/ express
var app = express();

var mongoose = require('mongoose');

// log requests to the console (express4)
var morgan = require('morgan');

// pull information from HTML POST (express4)
var bodyParser = require('body-parser');

// simulate DELETE and PUT (express4)
var methodOverride = require('method-override');

// configuration =================

var database = require('./config/database');
mongoose.connect(database.url);

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended': 'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

///// Routes
require('./app/routes')(app, kue);

// start the UI
kue.app.listen(3000);
console.log('UI started on port 3000');

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");