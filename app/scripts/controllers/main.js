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
  .controller('MainCtrl', function ($rootScope, $scope, $stateParams, CheckpointService, FirebaseGroupService, Notification) {
    //Get the selected group from the route parameters and set it in the scope
    var groupId = $stateParams.groupId;
    $scope.groupId = $rootScope.currentGroupId = groupId;

    //Check and see if the group exists in the Firebase, if not, add it.
    if(angular.isDefined(groupId) && groupId !== "")
      FirebaseGroupService.existsOrAdd(groupId);

    //Get Assets
    if(groupId !== "")
      $scope.checkpoints = CheckpointService.groupCheckpoints(groupId, 10).$asArray();

  });