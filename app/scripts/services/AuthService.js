'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.Auth
 * @description
 * # Auth
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .service('AuthService', function ($http, Session, UserService, APIKEY, APIPATH) {

    var AuthService = {

      login: function() {
        Session.set('currentRoute', window.location.href);
        window.location.replace(APIPATH+'users/login?api_key='+APIKEY+'&callback='+window.location.href);
      },

      logout: function() {
        return $http.get(APIPATH+'users/logout?api_key='+APIKEY)
            .then(function(response) {
              console.log('Logout Response', response);
              AuthService.expire();
            });
      },

      user: function() {
        var userId = AuthService.userId();
        return UserService.get(userId, 'groups');
      },

      userId: function() {
        if(Session.has('auth'))
          return Session.get('authUser');
        else
          return false;
      },
     
      check: function() {
        return Session.has('auth');
      },

      expire: function() {
        return !!Session.destroyAuthSession();
      },
     
      isAuthorized: function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (AuthService.check() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
      }

    };

    return AuthService;

  });
