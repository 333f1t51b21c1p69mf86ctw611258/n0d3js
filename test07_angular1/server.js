// server.js

// set up ========================
var express = require('express');
// create our app w/ express
var app = express();
// mongoose for mongodb
var mongoose = require('mongoose');
// log requests to the console (express4)
var morgan = require('morgan');
// pull information from HTML POST (express4)
var bodyParser = require('body-parser');
// simulate DELETE and PUT (express4)
var methodOverride = require('method-override');

// configuration =================

// mongoose.connect('mongodb://user_test:123456@olympia.modulusmongo.net:27017/Arir8emo');     // connect to mongoDB database on modulus.io
mongoose.connect('mongodb://127.0.0.1:27017/test');

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

// Define model
var Todo = mongoose.model('Todo', {
	text: String
});

///// Routes
// API
// Get all todos
function findAllTodos(res) {
	Todo.find(function (err, todos) {
		if (err) {
			res.send(err);
		}

		// Return all todos in JSON format
		res.json(todos);
	});
}

app.get('/api/todos', function (req, res) {
	findAllTodos(res);
});

// Create todo and send back all todos
app.post('/api/todos', function (req, res) {
	Todo.create({
		text: req.body.text,
		done: false
	}, function (err, todo) {
		if (err) {
			res.send(err);
		}

		findAllTodos(res);
	});
});

// Delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
	Todo.remove({

			_id: req.params.todo_id

		}, function (err, todo) {
			if (err) {
				res.send(err);
			}

			findAllTodos(res);
		}
	);
});

// Routes for Angular
app.get('*', function (req, res) {
	res.sendfile('./public/index.html');
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");