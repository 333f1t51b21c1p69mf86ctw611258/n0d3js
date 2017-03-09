var Todo = require('./models/todoModel');
var WorkLog = require('./models/workLogModel');

module.exports = function (app, kue) {
	var queue = kue.createQueue();

	var email = queue.create('email', {
		title: 'welcome email for tj'
		, to: 'tj@learnboost.com'
		, template: 'welcome-email'
	}).save(function (err) {
		if (!err) console.log(email.id);
	});

	email.on('start', function () {
		console.log('Start');
	});

	email.on('promotion', function () {
		console.log('Promotion');
	});

	email.on('complete', function () {
		console.log('Complete');
	});

	queue.process('email', function (job, done) {
		console.log(job.data.to);

		done();
	});


	app.post('/api/worklog/register', function (req, res) {
		WorkLog.create({
			user: req.body.user,
			page: req.body.page
		}, function (err, workLog) {
			if (err) {
				res.send(err);
			}

			res.send('OK');
		});
	});

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
			description: req.body.description,
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
}