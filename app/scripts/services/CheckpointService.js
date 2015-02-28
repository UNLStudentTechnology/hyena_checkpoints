/* global moment */
'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.CheckpointService
 * @description
 * # CheckpointService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
	.service('CheckpointService', function ($firebase, $q, AppFirebase) {
		var checkpointRef = AppFirebase.getRef();

		var CheckpointService = {
			/**
			* Gets a specific checkpoint
			* @param  string checkpointId
			* @return promise
			*/
			get: function getCheckpoint(checkpointId) {
				checkpointId = checkpointId.trim();
					return $firebase(checkpointRef.child('/checkpoints/'+checkpointId));
			},
			/**
			* Get all checkpoints associated with a group
			* @param  int groupId Group ID
			* @param  int limit   Number of items to return
			* @return promise
			*/
			groupCheckpoints: function getGroupCheckpoints(groupId, limit) {
				limit = limit || 20;
				groupId = parseInt(groupId);
				var checkpoints = checkpointRef.child('checkpoints').orderByChild("group_id").equalTo(groupId).limitToFirst(limit);
				return $firebase(checkpoints);
			},
			/**
			* Create a new checkpoint
			* @param string checkpoint
			* @param int groupId
			*/
			add: function addCheckpoint(checkpoint, groupId) {
				return $firebase(checkpointRef.child('checkpoints')).$push(checkpoint).then(function(response) {
			      //Add a reference to the group
			      $firebase(checkpointRef.child('/groups/'+groupId+'/checkpoints')).$set(response.key(), true);
			      return response;
			    });
			},
			/**
			* Remove timeclock and its associated clockins
			* @param  string checkpointId
			* @return promise
			*/
			remove: function removeCheckpoint(checkpointId) {
				checkpointId = checkpointId.trim();
				return $firebase(checkpointRef.child('/checkpoints/'+checkpointId)).$remove();
			},
			/**
			* Begins the clock in flow. 
			* @param  string checkpointId
			* @param  string nuid
			* @return promise
			*/
			checkIn: function clockinUser(checkpointId, userId) {
				//Create our checkin object
				var checkin = {
				  'created_at': moment().format(),
				  'checkpoint_id': checkpointId,
				  'user': userId
				};

				//Push new checkin
				return $firebase(checkpointRef.child('/checkins')).$push(checkin);
			},
			checkins: function getCheckins(checkpointId) {
				return $firebase(checkpointRef.child('/checkins').orderByChild("checkpoint_id").equalTo(checkpointId));
			},
			check: function checkUser(checkpointId, userId) {
				var deferred = $q.defer();

				var statusObject = $firebase(checkpointRef.child('/checkins').orderByChild('checkpoint_id').equalTo(checkpointId)).$asArray();
				statusObject.$loaded().then(function(response) {
					for (var i = 0; i < response.length; i++) {
						if(response[i].user === userId) {
							deferred.resolve(true);
						}
					}
					deferred.resolve(false);
				}, function(error) {
				  console.error('CheckpointService.check()', error);
				  deferred.reject('Error getting checkins.');
				});

				return deferred.promise;
			}
		};

		return CheckpointService;
	});
