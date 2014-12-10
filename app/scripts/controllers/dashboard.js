/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:MainCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, $routeParams, CheckpointService, Notification) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $routeParams.groupId;
    $scope.group = groupId;

    //Load a list of checkpoints
  	$scope.checkpoints = null;
    var checkpoints = CheckpointService.sync(groupId, 10);
	  checkpoints.$bindTo($scope, 'checkpoints');

    /**
     * Add a new checkpoint to the database
     */
    $scope.addCheckpoint = function() {
    	var checkpoint = {
    		title 		: $scope.checkpointTitle,
    		created_at	: moment().format()
    	};

    	var promise = CheckpointService.add($scope.group, checkpoint);
    	promise.then(function() {
    		$scope.checkpointTitle = '';
        //Show notification
        Notification.show('Your checkpoint has been added successfully!', 'success');
    	}, function(error) {
        console.log('Add checkpoint error', error);
        Notification.show(error.message, 'error');
      });
    };

  });
