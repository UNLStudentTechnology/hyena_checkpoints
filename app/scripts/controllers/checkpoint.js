/* global moment */
'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
  .controller('CheckpointCtrl', function ($scope, $http, $routeParams, CheckpointService, UserService, APIPATH) {
  	//Declare variables
  	var checkpointId = $routeParams.checkpointId;
    $scope.checkpoint = null;
  	var groupId = $routeParams.groupId;
  	$scope.group = groupId;
  	//End declare variables

  	console.log('Group ID', groupId);

    var checkpoint = CheckpointService.get(groupId, checkpointId);
	checkpoint.$bindTo($scope, 'checkpoint');

	/**
	 * Checks in a user to a particular checkpoint
	 * @return bool
	 */
	$scope.checkinUser = function() {
		console.log('Checkin...', $scope.checkinNcard);

		//After submission, validate the NUID and return (if possible)
		//the Blackboard Username associated with the NUID.
    	var validation = UserService.validate($scope.checkinNcard);
    	validation.then(function(user) {
    		//Was valid, create a new checkin
    		var bb_username = user.data[0];
	    	var checkin = {
	    		user 		: bb_username,
	    		created_at	: moment().format()
	    	};

	    	//Do the checkin
	    	var checkinPromise = CheckpointService.checkin($scope.checkpoint, checkin);
	    	checkinPromise.then(function() {
	    		$scope.checkinNcard = '';
	    	});
    	}, function(error) {
    		//Unable to validate, log the error
    		console.log(error);
    	});
    };

  });
