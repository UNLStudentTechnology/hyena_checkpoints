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
  .controller('ApplicationCtrl', function ($rootScope, $scope, $location, $window, $routeParams, $firebase, AuthService, UserService, AppFirebase, Notification, FBURL, AUTH_EVENTS) {
    //Initialize some variables
    $scope.appLoaded = null;
    $scope.currentUser = null;
    $rootScope.currentGroupId = 0;

    //AUTHENTICATION FLOW
    if(angular.isDefined($location.search().token)) //If this is new log in from CAS
    {
      $scope.appLoaded = true;
      //Get Query Params
      var authToken = $location.search().token;
      $location.url($location.path()); //Clear query params from address bar
      //Evaluate token from platform
      var tokenUser = AppFirebase.authenticate(authToken).then(function(authData) {
        //Process the user login
        AuthService.manualLogin(authData.uid, authToken, 'apps').then(function(user) {
          $scope.currentUser = user.data;
        }, function(error) {
          console.log('Login Error', error);
        });
      }, function(error) {
        console.error("Login failed:", error);
      });
    }
    else if(AuthService.check() && AppFirebase.getAuthRef().$getAuth() !== null) //Already authenticated, attempt to get existing session
    {
      $scope.appLoaded = true;
      AuthService.user('apps').then(function(user) {
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
      else if(oldVal !== null)
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

    // AppFirebase.getAuthRef().$onAuth(function(authData) {
    //   if (!authData) {
    //     $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    //   }
    // });

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

    /**
     * Manages page navigation and allows to specify a page animation
     * class to be set.
     * @param  string path                  href to location
     * @param  string pageAnimationClass    CSS animation class
     */
    $scope.go = function (path, pageAnimationClass) {
      if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
          $scope.pageAnimationClass = 'animate-slide-right';
      } 
      else { // Use the specified animation
          $scope.pageAnimationClass = pageAnimationClass;
      }

      if (path === 'back') { // Allow a 'back' keyword to go to previous page
          $scope.pageAnimationClass = 'animate-slide-left';
          $window.history.back();
      }    
      else { // Go to the specified path
          $location.path(path);
      }
    };

  });
