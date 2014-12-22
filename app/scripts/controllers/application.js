/* global Firebase */
'use strict';

/**
 * @ngdoc function
 * @name hyenaCheckpointsApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the hyenaCheckpointsApp
 */
angular.module('hyenaCheckpointsApp')
  .controller('ApplicationCtrl', function ($rootScope, $scope, $location, $window, $routeParams, $firebase, AuthService, UserService, AppFirebase, Session, Notification, FBURL, AUTH_EVENTS) {
    //Initialize some variables
    $scope.currentUser = null;

    //AUTHENTICATION FLOW
    var auth_user = null;
    if(typeof $location.search().user !== 'undefined') //If this is new log in from CAS
    {
      //Get Query Params
      var authToken = $location.search().token;
      $location.url($location.path()); //Clear query params from address bar
      //Evaluate token from platform
      var tokenUser = AppFirebase.authenticate(authToken).then(function(authData) {
        //Process the user login
        AuthService.manualLogin(authData.uid, authToken).then(function(user) {
          $scope.currentUser = user.data;
        }, function(error) {
          console.log('Login Error', error);
        });
      }, function(error) {
        console.error("Login failed:", error);
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
      Notification.showModal('Please log in', '#modal-content-login');
    }
    //END AUTHENTICATION FLOW

    /** 
     * Event handler for when the user logs in or out. Hides the page and shows a modal
     * prompting the user to log in.
     */
    $scope.$watch('currentUser', function(newVal, oldVal) {
      //console.log('currentUser', newVal, oldVal);
      if(oldVal !== null && (angular.isUndefined(newVal) || newVal === null))
        Notification.showModal('Please log in', '#modal-content-login');
      else
        Notification.hideModal();
    });
    
    /**
     * Event handler for when a 401 error is returned from an API. This will
     * cause the current authenticated session to expire.
     */
    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
      AuthService.expire();
      $scope.currentUser = null;
      AuthService.login();
    });

    /**
     * Event handler for deauthorization from Firebase
     */
    AppFirebase.getAuthRef().$onAuth(function(authData) {
      //console.log(authData);
      if(!authData)
      {
        //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    });

    /**
     * Sets the current user on scope.
     * @param Object user JSON user object
     */
  	$scope.setCurrentUser = function (user) {
  		$scope.currentUser = user;
  	};

    $scope.logOutCurrentUser = function() {
      $scope.currentUser = null;
      AuthService.logout();
    };

    /**
     * Starts the log in flow manually.
     */
    $scope.logIn = function() {
      if(!AuthService.check())
        AuthService.login();
    };

    /**
     * Toggles the main layout drawer
     */
    $scope.toggleMainDrawer = function() {
      document.querySelector('unl-layout').toggleDrawer();
    };

    /**
     * Toggles the main layout drawer
     */
    $scope.closeMainDrawer = function() {
      document.querySelector('unl-layout').closeDrawer();
    };

    /**
     * Callback function to show the login modal window.
     */
    $scope.showLoginWindow = function() {
      Notification.setModalContent('#modal-content-login');
    };

    $scope.closeModal = function() {
      Notification.hideModal();
    };

  });
