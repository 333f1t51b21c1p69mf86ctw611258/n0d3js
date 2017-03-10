var Todo = require('./models/todoModel');
var WorkLog = require('./models/workLogModel');
var queue;

module.exports = function (app, kue) {
	queue = kue.createQueue();

	queue.on('job enqueue', function(id, type){
		console.log( 'Job %s got queued of type %s', id, type );

	}).on('job complete', function(id, result){
		kue.Job.get(id, function(err, job){
			if (err) return;
			job.remove(function(err){
				if (err) throw err;
				console.log('removed completed job #%d', job.id);
			});
		});
	}).on( 'error', function( err ) {
		console.log( 'Oops... ', err );
	});

	app.post('/api/worklog/register', function (req, res) {
		var email = queue.create('email', {
			title: 'Account renewal required',
			to: 'tj@learnboost.com',
			template: 'renewal-email',
			user: req.body.user,
			page: req.body.page
		}).delay(5000)
			.priority('high')
			.save();

		email.on('start', function () {
			console.log('start');
		});

		email.on('promotion', function () {
			console.log('promotion');
		});

		email.on('complete', function (result) {
			console.log('complete with result: ' + result);
		});

		queue.process('email', 1, function (job, done) {
			console.log('### email: ' + job.data.to);

			WorkLog.create({
				user: job.data.user,
				page: job.data.page
			}, function (err, workLog) {
				console.log('>>> workLog: ');
				console.info(workLog);

				// if (err) {
				// 	res.send(err);
				// }
				//
				// res.send('OK');
			});

			setTimeout(function () {
				done();
			}, Math.random() * 5000);
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