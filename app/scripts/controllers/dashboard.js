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
  .controller('DashboardCtrl', function ($rootScope, $scope, $routeParams, CheckpointService, GroupService, Notification) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $routeParams.groupId;
    $scope.groupId = groupId;

    //Check and see if the group exists in the Firebase, if not, add it.
    if(angular.isDefined(groupId))
      GroupService.existsOrAdd(groupId);

    
    //Load a list of checkpoints
  	$scope.checkpoints = null;
    $scope.checkpoints = CheckpointService.sync(groupId, 10);
	  //checkpoints.$bindTo($scope, 'checkpoints');
    console.log($scope.checkpoints);

    /**
     * Add a new checkpoint to the Firebase
     */
    $scope.addCheckpoint = function() {
    	var checkpoint = {
    		title 		  : $scope.checkpointTitle,
    		created_at	: moment().format(),
        non_members : true
    	};

      //Add the checkpoint to Firebase
    	var promise = CheckpointService.add($scope.groupId, checkpoint);
    	promise.then(function() {
    		$scope.checkpointTitle = '';
        //Show notification
        Notification.show('Your checkpoint has been added successfully!', 'success');
    	}, function(error) {
        console.log('Add checkpoint error:', error);
        Notification.show(error.message, 'error');
      });
    };

    /**
     * Removes a checkpoint from the Firebase
     */
    $scope.removeCheckpoint = function(checkpointId) {
      var removePromise = CheckpointService.remove($scope.groupId, checkpointId);
      removePromise.then(function() {
        console.log('success');
        Notification.show('Your checkpoint has been removed successfully!', 'success');
      }, function(error) {
        console.log('Remove checkpoint error:', error);
        Notification.show(error.message, 'error');
      });
    };

  });