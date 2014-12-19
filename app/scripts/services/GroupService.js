'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.GroupService
 * @description
 * # GroupService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
	.service('GroupService', function (APIPATH, APIKEY, $http, $firebase, AppFirebase) {
		var groupsRef = AppFirebase.getRef().child('groups');

		var GroupService = {
			get: function getGroup(groupId, scope) {
				if(angular.isUndefined(scope))
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
			addUser: function addUser(groupId, user) {
				return $http.post(
					APIPATH+'groups/'+groupId+'/users?api_key='+APIKEY, 
					{ "users": [ user ] }
				);
			},
			hasUser: function hasUser(groupId, userId) {
				return $http.get(
					APIPATH+'groups/'+groupId+'/users/'+userId+'?api_key='+APIKEY);
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
