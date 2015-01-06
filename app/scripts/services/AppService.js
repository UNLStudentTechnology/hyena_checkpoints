'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.AppService
 * @description
 * # AppService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .service('AppService', function AppService($http, PLATFORM_ROOT, AuthService) {
  	return {
  		get: function getApp(appId) {
			return $http.get(PLATFORM_ROOT+'apps/'+appId+'?token='+AuthService.authToken());
		},
		update: function updateApp(appId, appData) {
			return $http.put(
				PLATFORM_ROOT+'apps/'+appId+'?token='+AuthService.authToken(), appData);
		}
  	};
  });