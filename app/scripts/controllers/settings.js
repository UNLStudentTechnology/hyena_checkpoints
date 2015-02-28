'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:CheckpointsettingsCtrl
 * @description
 * # CheckpointsettingsCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
	.controller('SettingsCtrl', function ($scope, $rootScope, $stateParams, CheckpointService, Notification) {
		//Get and set the current group ID
	  	var groupId = $stateParams.groupId;
	  	$scope.groupId = $rootScope.currentGroupId = groupId;
	  	//Get checkpoint id
	  	var checkpointId = $scope.checkpointId = $stateParams.checkpointId;

	  	//Get checkpoint
	  	var checkpoint = CheckpointService.get(checkpointId).$asObject();
	  	checkpoint.$bindTo($scope, 'checkpoint');

	  	$scope.showRemoveModal = function() {
	      Notification.showModal('Remove Checkpoint', '#modal-checkpoint-remove');
	    };

	    $scope.removeCheckpoint = function() {
	      CheckpointService.remove(checkpointId).then(function() {
	        Notification.hideModal();
	        Notification.show('Your checkpoint has been removed successfully!', 'success');

	        //Navigate back to checkpoints
	        $scope.go('/'+groupId, 'animate-slide-left');
	      }, function(error) {
	        Notification.hideModal();
	        console.log('Remove checkpoint error:', error);
	        Notification.show(error.message, 'error');
	      });
	    };
	});