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
  .controller('DashboardCtrl', function ($rootScope, $scope, $routeParams, CheckpointService) {
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
    		group_id 	: $scope.group,
    		created_at	: moment().format()
    	};

    	var promise = CheckpointService.add($scope.group, checkpoint);
    	promise.then(function() {
    		$scope.checkpointTitle = '';
    	});
    };

    //var sync = $firebase(ref);
  });
