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
    'ngStorage',
    'firebase',
    'angularMoment',
    'ngMessages'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'DashboardCtrl'
      })
      .when('/:groupId', {
        templateUrl: 'views/main.html',
        controller: 'DashboardCtrl'
      })
      .when('/:groupId/checkpoint/:checkpointId', {
        templateUrl: 'views/checkpoint.html',
        controller: 'CheckpointCtrl'
      })
      .when('/:groupId/checkpoint/:checkpointId/settings', {
        templateUrl: 'views/checkpoint_settings.html',
        controller: 'CheckpointSettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })
  .config(function ($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  })
  .constant('FBURL', 'https://amber-heat-9947.firebaseio.com/')
  .constant('APIKEY', 'MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk')
  .constant('APIPATH', 'http://st-studio.unl.edu/hyena_platform/public/api/1.0/')
  .constant('angularMomentConfig', {
    //timezone: 'America/Chicago'
  })
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  });