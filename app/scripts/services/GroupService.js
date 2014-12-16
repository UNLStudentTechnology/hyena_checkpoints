/* global Firebase */
'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.GroupService
 * @description
 * # GroupService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
	.service('GroupService', function GroupService(APIPATH, APIKEY, $http, FBURL, $firebase) {
		var groupsRef = new Firebase(FBURL).child('groups');

		return {
			get: function getGroup(groupId, scope) {
				if(typeof scope === 'undefined')
					scope = '';

				return $http.get(
					APIPATH+'groups/'+groupId+'?with='+scope+'&api_key='+APIKEY);
			},
			exists: function exists(groupId) {
				return $firebase(groupsRef.child(groupId)).$asObject();
			},
			add: function add(group) {
				return $firebase(groupsRef).$push(group);
			}
		};
	});
