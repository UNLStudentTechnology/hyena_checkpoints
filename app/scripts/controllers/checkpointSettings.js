'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:CheckpointsettingsCtrl
 * @description
 * # CheckpointsettingsCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
	.controller('CheckpointSettingsCtrl', function ($scope, $routeParams, CheckpointService, Notification) {
		//Declare variables
	  	var checkpointId = $routeParams.checkpointId;
	    $scope.checkpoint = null;
	  	var groupId = $routeParams.groupId;
	  	$scope.group = groupId;
	  	$scope.currentGroupId = groupId;
	  	//End declare variables

	  	//Get checkpoints for the active group
	    var checkpoint = CheckpointService.get(groupId, ccheckpointId).$asObject();
	    checkpoint.$bindTo($scope, 'checkpoint');
	    checkpoint.$watch(function() {
		    $scope.checkpointTitle = checkpoint.title;
		    $scope.nonMembers = checkpoint.non_members; //convert string to bool
		    //console.log('Non-Members?', checkpoint.non_members, $scope.nonMembers);
	    });

	    //Watch for checkbox change
	    var nonMembersCheckBox = document.getElementById("non-members-checkbox");
		nonMembersCheckBox.addEventListener("change", function() {
			if(angular.isDefined($scope.nonMembers))
			{
				$scope.nonMembers = !$scope.nonMembers;
				$scope.updateSettings();
			}
		});

	    $scope.updateSettings = function() {
	    	if(angular.isUndefined($scope.checkpointTitle) || $scope.checkpointTitle === "")
	    		return;

	    	var checkpointSettings = {
	    		title 		: $scope.checkpointTitle,
	    		non_members	: $scope.nonMembers
	    	};

	    	//Update checkpoint
	    	CheckpointService.update(groupId, checkpointId, checkpointSettings).then(function(response) {
	    		//Nothing to do on success
	    	}, function(error) {
	    		//Unable to validate, log the error
	    		console.log('Checkpoint update error', error);
	    		Notification.show(error.data, 'error');
	    	});
	    };
	});
