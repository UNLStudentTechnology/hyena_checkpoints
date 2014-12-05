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
	.service('CheckpointService', function CheckpointService(FBURL, $firebase) {
		var checkpointsRef = new Firebase(FBURL).child('groups/1/checkpoints');

		return {
			get: function getCheckpoint(checkpointId) {
				return $firebase(checkpointsRef.child(checkpointId)).$asObject();
			},
			sync: function sync(limit) {
				return $firebase(checkpointsRef.limit(limit)).$asObject();
			},
			add: function addCheckpoint(checkpoint) {
				return $firebase(checkpointsRef).$push(checkpoint);
			},
			checkin: function checkinUser(checkpointId, checkin) {
				return $firebase(checkpointsRef.child(checkpointId).child('checkins')).$push(checkin);
			}
		};
	});
