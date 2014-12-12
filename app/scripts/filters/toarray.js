'use strict';

/**
 * @ngdoc filter
 * @name hyenaCheckpointsApp.filter:toArray
 * @function
 * @description
 * # toArray
 * Filter in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
  .filter('toArray', function () {
    return function (obj) {
      	if (!(obj instanceof Object)) {
            return obj;
        }
        return Object.keys(obj).map(function (key) {
	        return Object.defineProperty(obj[key], '$key', { enumerable: false, value: key});
	      });
    };
  });
