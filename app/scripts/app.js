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
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angularMoment',
    'hyenaAngular',
    'ngTagsInput',
    'ngStorage',
    'ngCsv'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      //Layouts
      .state('unl-layout', {
        templateUrl: 'views/layouts/unl-layout.html',
        data: {
          requireAuth: true
        }
      })
      .state('unl-layout-kiosk', {
        templateUrl: 'views/layouts/unl-layout-kiosk.html',
        data: {
          requireAuth: false
        }
      })
      //Views
      .state('unl-layout.checkpoints', {
        url: '/:groupId',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('unl-layout.checkpoint_new', {
        url: '/:groupId/checkpoint/new',
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
      })
      .state('unl-layout.checkpoint_settings', {
        url: '/:groupId/checkpoint/:checkpointId/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('unl-layout.checkpoint_view', {
        url: '/:groupId/checkpoint/:checkpointId',
        templateUrl: 'views/checkpoint.html',
        controller: 'CheckpointCtrl'
      })
      .state('unl-layout-kiosk.checkpoint_kiosk', {
        url: '/:groupId/checkpoint/:checkpointId/kiosk',
        templateUrl: 'views/checkpoint_kiosk.html',
        controller: 'CheckpointCtrl'
      });
      //Default Route
      $urlRouterProvider.otherwise("/");
      //End Default Route
      
      //Remove # from URLs
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
  .constant('PLATFORM_ROOT', 'http://st-studio.unl.edu/hyena_platform/public/')
  .constant('AUTH_SCOPE', 'groups');