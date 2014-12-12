/* global Firebase */
'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.CheckpointService
 * @description
 * # CheckpointService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
	.service('CheckpointService', function (FBURL, $firebase) {
		var checkpointsRef = new Firebase(FBURL);

		var CheckpointService = {
			groupFirebaseRef: function groupFirebaseRef(groupId) {
				return checkpointsRef.child('groups/'+groupId+'/checkpoints');
			},
			get: function getCheckpoint(groupId, checkpointId) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).child(checkpointId)).$asObject();
			},
			sync: function sync(groupId, limit) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).limit(limit)).$asArray();
			},
			add: function addCheckpoint(groupId, checkpoint) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId)).$push(checkpoint);
			},
			remove: function removeCheckpoint(groupId, checkpointId) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId)).$remove(checkpointId);
			},
			checkin: function checkinUser(groupId, checkpointId, checkin) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).child(checkpointId+'/checkins')).$push(checkin);
			}
		};

		return CheckpointService;
	});
