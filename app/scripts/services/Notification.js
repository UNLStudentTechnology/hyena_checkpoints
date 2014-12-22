'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.Notification
 * @description
 * # Notification
 * Provides API for showing toasts and modal dialogs.
 */
angular.module('hyenaCheckpointsApp')
  .service('Notification', function Notification() {

    var NotificationService = {
    	show: function(text, type) {
    		var toast = document.querySelector('unl-toast');
        toast.setAttribute("text", text);
        toast.setAttribute("type", type);
        toast.show();
    	},

      showModal: function(heading, content) {
        var modal = document.querySelector('#unl-modal');
        var newContent = document.querySelector(content);
        modal.setAttribute("heading", heading);
        modal.contents = newContent;
        modal.show();
      },

      hideModal: function() {
        var modal = document.querySelector('#unl-modal');
        modal.close();
      },

      setModalContent: function(content) {
        var modal = document.querySelector('#unl-modal');
        var newContent = document.querySelector(content);
        modal.contents = newContent;
      }
    };

    return NotificationService;
  });
