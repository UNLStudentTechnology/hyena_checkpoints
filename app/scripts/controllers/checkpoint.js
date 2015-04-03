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
  .controller('CheckpointCtrl', function ($scope, $rootScope, $stateParams, UserService, GroupService, CheckpointService, Notification) {
    //Declare Variables
    $scope.doingCheckin = false;
    $scope.sortField = "created_at";
    $scope.sortDirection = true;
  	//Get and set the current group ID
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;
    //Get checkpoint id
    var checkpointId = $scope.checkpointId = $stateParams.checkpointId;

    //Get checkpoint
    var checkpoint = CheckpointService.get(checkpointId).$asObject();
    checkpoint.$bindTo($scope, 'checkpoint');

    //Get checkins
    $scope.checkins = CheckpointService.checkins(checkpointId).$asArray();

    //CSV Export Headers
    $scope.csvHeaders = ['Check In Time', 'First Name', 'Last Name', 'Blackboard Username', 'Year', 'Major', 'College'];

    /**
     * Changes the sort direction for the checkin list
     */
    $scope.toggleSort = function() {
      $scope.sortDirection = !$scope.sortDirection;
    };

  	/**
  	 * Checks in a user to a particular checkpoint
  	 * @return bool
  	 */
  	$scope.checkInUser = function() {
      $scope.doingCheckin = true;
  		//Validate the NUID and return BB username
    	UserService.validate($scope.checkinNcard).then(function(user) {
    		var validatedUser = user.data.users_validated[0];

    		//Check and see if the user is a part of the group
	    	GroupService.hasUser(groupId, validatedUser).then(function(response) {
    			//Is part of group, check them in
    			processCheckin(validatedUser);
    		}, function(error) {
    			//Not part of group, check and see if the user has permission to check in. (non_member setting on checkpoint)
	    		if($scope.checkpoint.non_members != 1) //If members aren't allowed
	    		{
	    			$scope.checkinNcard = '';
            $scope.checkinForm.$setPristine();
            $scope.doingCheckin = false;
            Notification.show('Sorry! You are not a member of this group.', 'error');
		    	}
		    	else
		    	{
		    		processCheckin(validatedUser);
            //Add user to group
            if(angular.isDefined($scope.checkpoint.add_to_group) && $scope.checkpoint.add_to_group == 1)
            {
  		    		var addUserResponse = GroupService.usersAdd(groupId, {users:[validatedUser]});
  		    		addUserResponse.then(function(response) {
  		    			console.log('User added to group.');
  		    		});
            }
		    	}
    		});
    	}, function(error) {
    		//Unable to validate, log the error
        $scope.checkinNcard = '';
        $scope.checkinForm.$setPristine();
        $scope.doingCheckin = false;
    		console.log(error);
    		Notification.show(error.data.message, 'error');
    	});
    };

    /**
     * Runs the actual checkin process on the server
     * @param  string validatedUser Blackboard username
     * @return null
     */
    function processCheckin(validatedUser) {

      CheckpointService.check(checkpointId, validatedUser).then(function(response) {
        //Only check in if they're not already in
        if(!response)
        {
          //Do the checkin
          CheckpointService.checkIn(checkpointId, validatedUser).then(function(response) {
            //console.log('Checkin Response', response);
            Notification.show('Thanks! You have been checked in!', 'success');
          }, function(error) {
            Notification.show('Sorry! There was an error checking you in.', 'error');
          });
        }
        else
        {
          Notification.show('Sorry! You are already checked in.', 'error');
        }
      }, function(error) {
        console.log('Check() Error', error);
        Notification.show('Sorry! There was an error checking you in.', 'error');
      });

      //Reset form
      $scope.doingCheckin = false;
      $scope.checkinNcard = '';
      $scope.checkinForm.$setPristine();
    }

    /**
     * Returns a clean array to be exported to CSV
     * @return array Array of checkins
     */
    $scope.getExportArray = function() {
      return CheckpointService.exportCheckins($scope.checkins);
    };

  });
