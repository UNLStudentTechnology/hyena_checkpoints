/* global Firebase */
'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.firebase
 * @description
 * # firebase
 * Factory in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .factory('AppFirebase', function (FBURL, $firebase) {
    var appFirebase = new Firebase(FBURL);

    return appFirebase;
  });
