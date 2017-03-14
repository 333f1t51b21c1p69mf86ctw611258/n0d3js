'use strict';

/**
 * @ngdoc function
 * @name test09YeomanAngular1App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the test09YeomanAngular1App
 */
angular.module('test09YeomanAngular1App')
  .controller('MainCtrl', function ($scope) {
    // this.awesomeThings = [
    //   'HTML5 Boilerplate',
    //   'AngularJS',
    //   'Karma'
    // ];

    $scope.todos = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addTodo = function () {
      $scope.todos.push($scope.todo);
      $scope.todo = '';
    }

    $scope.removeTodo = function (index) {
      $scope.todos.splice(index, 1);
    }
  });
