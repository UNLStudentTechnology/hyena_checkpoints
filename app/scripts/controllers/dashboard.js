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
    if(groupId && !GroupService.exists(groupId))
    {
      var groupCheckResponse = GroupService.get(groupId); //Get group information from platform
      groupCheckResponse.then(function(response) {
          //New Group Object
          var newGroup = {
            title: response.data.title,
            description: response.data.description
          };
          //Add the group
          GroupService.add(newGroup);
      });
    }
    
    //Load a list of checkpoints
  	$scope.checkpoints = null;
    $scope.checkpoints = CheckpointService.sync(groupId, 10);
	  //checkpoints.$bindTo($scope, 'checkpoints');

    /**
     * Add a new checkpoint to the database
     */
    $scope.addCheckpoint = function() {
    	var checkpoint = {
    		title 		: $scope.checkpointTitle,
    		created_at	: moment().format()
    	};

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