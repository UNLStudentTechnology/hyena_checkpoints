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
	.service('GroupService', function (APIPATH, APIKEY, $http, FBURL, $firebase) {
		var groupsRef = new Firebase(FBURL).child('groups');

		var GroupService = {
			get: function getGroup(groupId, scope) {
				if(typeof scope === 'undefined')
					scope = '';

				return $http.get(
					APIPATH+'groups/'+groupId+'?with='+scope+'&api_key='+APIKEY);
			},
			exists: function exists(groupId) {
				var groupExistsResponse = $firebase(groupsRef.child(groupId)).$asObject();
				return groupExistsResponse.$loaded(function() {
				    return groupExistsResponse.$value !== null;
				});
			},
			add: function add(group, groupId) {
				return $firebase(groupsRef).$set(groupId, group);
			},
			existsOrAdd: function existOrAdd(groupId) {
				var groupExistsPromise = GroupService.exists(groupId);
				groupExistsPromise.then(function(response) {
					if(!response)
					{
						var getGroupPromise = GroupService.get(groupId);
						getGroupPromise.then(function(response) {
							var newGroup = {
					          title: response.data.title,
					          description: response.data.description
					        };

					         GroupService.add(newGroup, groupId).then(function(response) {
					         	console.log('Group added to Firebase', response);
					         });
						});
					}
				});
			}
		};
		return GroupService;
	});
