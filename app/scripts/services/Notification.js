'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.Notification
 * @description
 * # Notification
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .service('Notification', function Notification() {

    var NotificationService = {
    	show: function(text, type) {
    		var toast = document.querySelector('unl-toast');
	        toast.setAttribute("text", text);
	        toast.setAttribute("type", type);
	        toast.show();
    	}
    };

    return NotificationService;
  });
