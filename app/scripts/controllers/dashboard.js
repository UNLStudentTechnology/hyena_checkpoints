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
  .controller('DashboardCtrl', function ($rootScope, $scope, CheckpointService) {

    //Load a list of checkpoints
  	$scope.checkpoints = null;
    var checkpoints = CheckpointService.sync(10);
	  checkpoints.$bindTo($scope, 'checkpoints');

    /**
     * Add a new checkpoint to the database
     */
    $scope.addCheckpoint = function() {
    	var checkpoint = {
    		title 		: $scope.checkpointTitle,
    		group_id 	: 1,
    		created_at	: moment().format()
    	};

    	var promise = CheckpointService.add(checkpoint);
    	promise.then(function() {
    		$scope.checkpointTitle = '';
    	});
    };

    //var sync = $firebase(ref);
  });
