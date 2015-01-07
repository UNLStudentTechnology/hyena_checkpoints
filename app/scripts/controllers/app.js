'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:AppctrlCtrl
 * @description
 * # AppctrlCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
  .controller('AppCtrl', function ($scope, $routeParams, AppService, Notification) {
  	//Get the requested app by ID
  	var appId = parseInt($routeParams.appId);
    AppService.get(appId).then(function(response) {
    	$scope.app = response.data;
    });

    $scope.$watch('app', function(newValue, oldValue) {
    	if(angular.isDefined(oldValue) && newValue !== null && newValue !== oldValue)
    	{
    		$scope.updateApp();
    	}
    }, true);

    /**
     * Updates remote data for app
     */
    $scope.updateApp = function() {
    	AppService.update(appId, $scope.app).then(function(response) {
    		for (var i = 0; i < $scope.currentUser.apps.length; i++) {
    			if($scope.currentUser.apps[i].id === appId)
    			{
    				$scope.currentUser.apps[i] = $scope.app;
    				break;
    			}
    		}
    	}, function(error) {
    		Notification.show('Sorry! There was an error.', 'error');
    	});
    };

  });
