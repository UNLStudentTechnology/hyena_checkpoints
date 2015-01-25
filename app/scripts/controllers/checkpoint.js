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
  .controller('CheckpointCtrl', function ($scope, $http, $routeParams, CheckpointService, UserService, GroupService, Notification, APIPATH) {
  	//Declare variables
  	var checkpointId = $routeParams.checkpointId;
    $scope.checkpoint = $scope.checkins = null;
  	var groupId = $routeParams.groupId;
  	$scope.group = groupId;
    $scope.currentGroupId = groupId;
    $scope.kioskMode = false;
  	//End declare variables

  	//Get checkpoints for the active group
    $scope.checkpoint = CheckpointService.get(groupId, checkpointId).$asObject();
    $scope.checkins = CheckpointService.checkins(groupId, checkpointId).$asArray();

    /**
     * Toggles kiosk mode, an interface for direct customer use.
     */
    $scope.toggleKioskMode = function() {
      $scope.hideMainDrawer();
      $scope.kioskMode = !$scope.kioskMode;
    };

  	/**
  	 * Checks in a user to a particular checkpoint
  	 * @return bool
  	 */
  	$scope.checkinUser = function() {
  		console.log('Checking in ID...', $scope.checkinNcard);

  		//After submission, validate the NUID and return (if possible)
  		//the Blackboard Username associated with the NUID.
    	var validation = UserService.validate($scope.checkinNcard);
    	validation.then(function(user) {
    		var validatedUser = user.data.users_validated[0];

    		//Check and see if the user is a part of the group
	    	var hasUserResponse = GroupService.hasUser($scope.group, validatedUser);
    		hasUserResponse.then(function(response) {
    			//Is part of group, check them in
    			processCheckin(validatedUser);
    		}, function(error) {
    			//Not part of group, check and see if the user has permission to check in. (non_member setting on checkpoint)
	    		if(!$scope.checkpoint.non_members) //If members aren't allowed
	    		{
	    			$scope.checkinNcard = '';
            $scope.checkinUserForm.$setPristine();
		    		Notification.show('Sorry! You are not a member of this group.', 'error');
		    	}
		    	else
		    	{
		    		processCheckin(validatedUser);
		    		var addUserResponse = GroupService.addUser($scope.group, validatedUser);
		    		addUserResponse.then(function(response) {
		    			console.log('User added to group.');
		    		});
		    	}
    		});
    	}, function(error) {
    		//Unable to validate, log the error
        $scope.checkinNcard = '';
        $scope.checkinUserForm.$setPristine();
    		console.log(error);
    		Notification.show(error.data, 'error');
    	});
    };

    /**
     * Runs the actual checkin process on the server
     * @param  string validatedUser Blackboard username
     * @return null
     */
    function processCheckin(validatedUser) {
    	//Was valid, create a new checkin
    	var checkin = {
    		user 		: validatedUser,
    		created_at	: moment().format()
    	};

    	//Do the checkin
    	var checkinPromise = CheckpointService.checkin($scope.group, $scope.checkpoint.$id, checkin);
    	checkinPromise.then(function(response) {
        //console.log('Checkin Response', response);
    		Notification.show('Thanks! You have been checked in!', 'success');
    	}, function(error) {
    		//Unable to validate, log the error
    		console.log('Checkin error', error);
    		Notification.show('Sorry! You are already checked in!', 'error');
    	});
      $scope.checkinNcard = '';
      $scope.checkinUserForm.$setPristine();
    }

  });
