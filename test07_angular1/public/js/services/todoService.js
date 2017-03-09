angular.module('todoService', [])

// super simple service
// each function returns a promise object
	.factory('Todos', function ($http) {
		return {
			get: function () {
				return $http.get('/api/todos');
			},
			create: function (todoData) {
				console.info(todoData);
				return $http.post('/api/todos', todoData);
			},
			delete: function (id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	})
	.factory('WorkLogs', function ($http) {
		return {
			register: function (workLogData) {
				return $http.post('/api/worklog/register', workLogData);
			}
		}
	});