'use strict';

/**
 * @ngdoc filter
 * @name hyenaCheckpointsApp.filter:user
 * @function
 * @description
 * # user
 * Filter in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .filter('user', function (UserService) {
    var userFilter = function (input) {
    	var user = UserService.getUserRelations(input);
    	return input;
    };
    userFilter.$stateful = true;
    return userFilter;
  });
