/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:NewCtrl
 * @description
 * # NewCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
  .controller('NewCtrl', function ($scope, $rootScope, $stateParams, Notification, CheckpointService) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Default checkpoint settings
    $scope.checkpoint = {
    	created_at: moment().format(),
        group_id: parseInt(groupId),
        non_members: true
    };

    /**
     * Creates a new checkpoint on the Firebase
     */
    $scope.createCheckpoint = function() {
    	CheckpointService.add($scope.checkpoint, groupId).then(function(response) {
    		console.log(response);
    		var checkpointId = response.key();
    		//Redirect and notify
    		$scope.go('/'+groupId+'/checkpoint/'+checkpointId);
    		Notification.show('Your checkpoint has been created successfully!', 'success');
    	}, function(error) {
    		console.log('Create Checkpoint Error', error);
    		Notification.show('There was an error creating your checkpoint.', 'error');
    	});
    };
  });
