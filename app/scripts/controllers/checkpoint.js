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
  .controller('CheckpointCtrl', function ($scope, $routeParams, CheckpointService) {
  	var checkpointId = $routeParams.checkpointId;
    $scope.checkpoint = null;
    $scope.counter = 0;

    var checkpoint = CheckpointService.get(checkpointId);
	checkpoint.$bindTo($scope, 'checkpoint');

  });
