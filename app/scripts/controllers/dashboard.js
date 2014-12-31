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
    $scope.selectedCheckpoint = null;
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $routeParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;
    

    //Check and see if the group exists in the Firebase, if not, add it.
    if(angular.isDefined(groupId))
      GroupService.existsOrAdd(groupId);

    
    //Load a list of checkpoints
  	$scope.checkpoints = null;
    $scope.checkpoints = CheckpointService.sync(groupId, 10);
	  //checkpoints.$bindTo($scope, 'checkpoints');
    //console.log($scope.checkpoints);

    /**
     * Add a new checkpoint to the Firebase
     */
    $scope.addCheckpoint = function() {
      if(angular.isUndefined($scope.checkpointTitle) || $scope.checkpointTitle === "")
        return;

      //Create the checkpoint object
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
    $scope.removeCheckpoint = function() {
      var removePromise = CheckpointService.remove($scope.groupId, $scope.selectedCheckpoint);
      removePromise.then(function() {
        Notification.hideModal();
        Notification.show('Your checkpoint has been removed successfully!', 'success');
      }, function(error) {
        Notification.hideModal();
        console.log('Remove checkpoint error:', error);
        Notification.show(error.message, 'error');
      });
    };

    $scope.confirmRemoveCheckpoint = function(checkpointId) {
      $scope.selectedCheckpoint = checkpointId;
      Notification.showModal('Delete Checkpoint', '#modal-checkpoint-delete');
    };

  });