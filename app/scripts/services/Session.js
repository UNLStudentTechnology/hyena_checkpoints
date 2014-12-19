'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.Session
 * @description
 * # Session
 * Manages interaction with HTML5 sessionStorage and the authentication session.
 */
angular.module('hyenaCheckpointsApp')
  .service('Session', function Session(AppFirebase) {
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
		createAuthSession: function(userId, authToken){
			sessionStorage.setItem('auth', true);
			sessionStorage.setItem('authUser', userId);
			sessionStorage.setItem('authToken', authToken);
			return true;
		},
		destroyAuthSession: function(){
			sessionStorage.removeItem('auth');
			sessionStorage.removeItem('authUser');
			sessionStorage.removeItem('authToken');
		}
	};
  });
