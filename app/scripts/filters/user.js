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
    return function (input) {
    	var userResponse = UserService.get(input);
    	return userResponse.then(function(user) {
    		return "yes";
    	});
    };
  });
