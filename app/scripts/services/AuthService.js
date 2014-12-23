'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.Auth
 * @description
 * # Auth
 * Reusable service that maintains a clientside authentication state.
 * REQUIRES the session and user service.
 */
angular.module('hyenaCheckpointsApp')
  .service('AuthService', function ($http, $sessionStorage, $localStorage, UserService, APIKEY, APIPATH, AppFirebase) {
    var firebaseAuthRef = AppFirebase.getRef();

    var AuthService = {

      /**
       * Starts the CAS authorization flow.
       * WARNING: This is a redirect, not http request. This will leave current app flow.
       * @return N/A
       */
      login: function() {
        $sessionStorage.currentRoute = window.location.href;
        window.location.replace(APIPATH+'users/login?api_key='+APIKEY+'&callback='+window.location.href);
      },

      /**
       * Manually create an authentication session based on a user ID.
       * @param  string userId Blackboard Username
       * @return Promise
       */
      manualLogin: function(userId, authToken) {
        var auth_user = UserService.get(userId, 'groups');
        return auth_user.then(function(user) {
          if(AuthService.createAuthSession(userId, authToken))
            return AuthService.user();
          else
            return false;
        });
      },

      /**
       * Logs a user out of the platform and destroys the local session.
       * @return Promise
       */
      logout: function() {
        firebaseAuthRef.unauth();
        AuthService.expire();
        window.location.replace(APIPATH+'users/logout?api_key='+APIKEY);
      },

      createAuthSession: function(userId, authToken) {
        $localStorage.auth = true;
        $localStorage.authUser = userId;
        $localStorage.authToken = authToken;
        return true;
      },

      /**
       * Gets the user object of the currently logged in user
       * @return Promise
       */
      user: function() {
        var userId = AuthService.userId();
        return UserService.get(userId, 'groups');
      },

      userId: function() {
        if($localStorage.auth)
          return $localStorage.authUser;
        else
          return false;
      },
     
      /**
       * Checks to see if someone is currently logged in
       * @return bool
       */
      check: function() {
        return !!$localStorage.auth;
      },

      /**
       * Destroys the current session
       * @return bool
       */
      expire: function() {
        firebaseAuthRef.unauth();
        delete $localStorage.auth;
        delete $localStorage.authUser;
        delete $localStorage.authToken;
      }

    };

    return AuthService;

  });
