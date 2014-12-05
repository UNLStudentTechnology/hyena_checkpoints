'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.Session
 * @description
 * # Session
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .service('Session', function Session() {
	return{
		has: function(key){
			return !!sessionStorage.getItem(key);
		},
		get: function(key){
			return sessionStorage.getItem(key);
		},
		set: function(key,val){
			return sessionStorage.setItem(key,val);
		},
		unset: function(key){
			return sessionStorage.removeItem(key);
		},
		createAuthSession: function(userId){
			sessionStorage.setItem('auth', true);
			sessionStorage.setItem('authUser', userId);
			return true;
		},
		destroyAuthSession: function(){
			sessionStorage.removeItem('auth');
			sessionStorage.removeItem('authUser');
		}
	};
  });
