'use strict';

/**
 * @ngdoc overview
 * @name hyenaCheckpointsApp
 * @description
 * # hyenaCheckpointsApp
 *
 * Main module of the application.
 */
angular
  .module('hyenaCheckpointsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'DashboardCtrl'
      })
      .when('/checkpoint/:checkpointId', {
        templateUrl: 'views/checkpoint.html',
        controller: 'CheckpointCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('FBURL', 'https://amber-heat-9947.firebaseio.com/')
  .constant('APIKEY', 'MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk');
