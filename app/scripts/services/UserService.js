/* global Firebase */
'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.UserService
 * @description
 * # UserService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
	.service('UserService', function (APIPATH, APIKEY, $http) {
		return {
			get: function getUser(userId, scope) {
				if(typeof scope === 'undefined')
					scope = '';

				return $http.get(
					APIPATH+'users/'+userId+'?with='+scope+'&api_key='+APIKEY);
			},
			validate: function validate(user) {
				return $http.post(
					APIPATH+'users/validate?api_key='+APIKEY, 
					{ "ids": [ user ] }
				);
			}
		};
	});
