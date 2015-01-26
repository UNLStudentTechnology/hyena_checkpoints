'use strict';

/**
 * @ngdoc service
 * @name hyenaCheckpointsApp.CheckpointService
 * @description
 * # CheckpointService
 * Service in the hyenaCheckpointsApp.
 */
angular.module('hyenaCheckpointsApp')
	.service('CheckpointService', function ($firebase, Session, AppFirebase) {
		var checkpointsRef = AppFirebase.getRef();

		var CheckpointService = {
			groupFirebaseRef: function groupFirebaseRef(groupId) {
				return checkpointsRef.child('groups/'+groupId+'/checkpoints');
			},
			get: function getCheckpoint(groupId, checkpointId) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).child(checkpointId));
			},
			sync: function sync(groupId, limit) {
				limit = limit || 20;
				return $firebase(CheckpointService.groupFirebaseRef(groupId).limitToFirst(limit));
			},
			add: function addCheckpoint(groupId, checkpoint) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId)).$push(checkpoint);
			},
			update: function updateCheckpoint(groupId, checkpointId, checkpoint) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).child(checkpointId)).$update(checkpoint);
			},
			remove: function removeCheckpoint(groupId, checkpointId) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId)).$remove(checkpointId);
			},
			checkin: function checkinUser(groupId, checkpointId, checkin) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).child(checkpointId+'/checkins')).$set(checkin.user, checkin);
			},
			checkins: function getCheckins(groupId, checkpointId) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId).child(checkpointId+'/checkins'));
			}
		};

		return CheckpointService;
	});
