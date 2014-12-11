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
  .controller('CheckpointCtrl', function ($scope, $http, $routeParams, CheckpointService, UserService, Notification, APIPATH) {
  	//Declare variables
  	var checkpointId = $routeParams.checkpointId;
    $scope.checkpoint = null;
  	var groupId = $routeParams.groupId;
  	$scope.group = groupId;
  	//End declare variables

  	//Get checkpoints for the active group
    var checkpoint = CheckpointService.get(groupId, checkpointId);
	checkpoint.$bindTo($scope, 'checkpoint');

	/**
	 * Checks in a user to a particular checkpoint
	 * @return bool
	 */
	$scope.checkinUser = function() {
		console.log('Checkining in ID...', $scope.checkinNcard);

		//After submission, validate the NUID and return (if possible)
		//the Blackboard Username associated with the NUID.
    	var validation = UserService.validate($scope.checkinNcard);
    	validation.then(function(user) {
    		//Was valid, create a new checkin
    		var bb_username = user.data.users_validated[0];
	    	var checkin = {
	    		user 		: bb_username,
	    		created_at	: moment().format()
	    	};

	    	//Do the checkin
	    	var checkinPromise = CheckpointService.checkin($scope.group, $scope.checkpoint.$id, checkin);
	    	checkinPromise.then(function(response) {
	    		$scope.checkinNcard = '';
	    		Notification.show('Thanks! You have been checked in!', 'success');
	    	}, function(error) {
	    		//Unable to validate, log the error
	    		console.log('Checkin error', error);
	    		Notification.show(error.data, 'error');
	    	});
    	}, function(error) {
    		//Unable to validate, log the error
    		console.log(error);
    		Notification.show(error.data, 'error');
    	});
    };

  });
