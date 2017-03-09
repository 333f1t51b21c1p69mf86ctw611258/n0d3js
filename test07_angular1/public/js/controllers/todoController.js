angular.module('todoModule', [])
	.controller('workLogController', ['$scope', '$http', 'WorkLogs', function ($scope, $http, WorkLogs) {
		var obj = {
			user: 'user_test',
			page: 'index'
		};

		console.info(obj);

		WorkLogs.register(obj)
			.success(function (data) {
				console.log(data);
			});
	}])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope', '$http', 'Todos', function ($scope, $http, Todos) {
		$scope.formData = {};

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function (data) {
				$scope.todos = data;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function () {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			// people can't just hold enter to keep adding the same to-do anymore
			if (!$.isEmptyObject($scope.formData)) {

				console.log('formData >>>');
				console.info($scope.formData);

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)
				// if successful creation, call our get function to get all the new todos
					.success(function (data) {
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function (id) {
			Todos.delete(id)
			// if successful creation, call our get function to get all the new todos
				.success(function (data) {
					$scope.todos = data; // assign our new list of todos
				});
		};
	}]);