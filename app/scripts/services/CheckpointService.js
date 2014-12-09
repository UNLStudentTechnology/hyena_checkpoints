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
				return $firebase(CheckpointService.groupFirebaseRef(groupId).limit(limit)).$asObject();
			},
			add: function addCheckpoint(groupId, checkpoint) {
				return $firebase(CheckpointService.groupFirebaseRef(groupId)).$push(checkpoint);
			},
			checkin: function checkinUser(checkpoint, checkin) {
				return $firebase(CheckpointService.groupFirebaseRef(checkpoint.group_id).child(checkpoint.group_id+'/checkins')).$push(checkin);
			}
		};

		return CheckpointService;
	});
