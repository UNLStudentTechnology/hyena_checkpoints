'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
  .controller('ApplicationCtrl', function ($rootScope, $scope, $location, $window, AuthService, UserService, Session, AUTH_EVENTS, USER_ROLES) {
    //Initialize some variables
    $scope.currentUser = null;
  	$scope.userRoles = USER_ROLES;
  	$scope.isAuthorized = AuthService.isAuthorized;

    var auth_user = null;

    //AUTHENTICATION FLOW
    if(typeof $location.search().user !== 'undefined') //If this is new log in from CAS
    {
      var authUser = $location.search().user;
      $location.url($location.path()); //remove query param from address bar
      AuthService.manualLogin(authUser).then(function(user) {
        $scope.currentUser = user.data;
      }, function(error) {
        console.log('Login Error', error);
      });
    }
    else if(AuthService.check()) //Already authenticated, attempt to get existing session
    {
      AuthService.user().then(function(user) {
        $scope.currentUser = user.data;
      });
    }
    else
    {
      AuthService.login(); //Start the CAS flow
    }

    
    /**
     * Event handler for when a 401 error is returned from an API. This will
     * cause the current authenticated session to expire.
     * @return {[type]} [description]
     */
    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
      AuthService.expire();
      $scope.currentUser = null;
      AuthService.login();
    });

    /**
     * Sets the current user on scope.
     * @param Object user JSON user object
     */
  	$scope.setCurrentUser = function (user) {
  		$scope.currentUser = user;
  	};

    $scope.logoutCurrentUser = function() {
      if(AuthService.logout())
      {
        $scope.currentUser = null;
        AuthService.login();
      }
    };

    /**
     * [toggleMainDrawer description]
     * @return {[type]} [description]
     */
    $scope.toggleMainDrawer = function() {
      document.querySelector('unl-layout').toggleDrawer();
    };

  });
