'use strict';

/**
 * @ngdoc service
 * @name test09YeomanAngular1App.commonservice
 * @description
 * # commonservice
 * Service in the test09YeomanAngular1App.
 */
angular.module('test09YeomanAngular1App')
  .service('commonservice', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  })
  .factory('WorkLogs', function ($http) {
    return {
      getMessage: function () {
        return 'test message';
      }
    }
  });
