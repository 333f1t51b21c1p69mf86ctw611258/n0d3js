var Todo = require('./models/todo');

module.exports = function (app) {
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
}