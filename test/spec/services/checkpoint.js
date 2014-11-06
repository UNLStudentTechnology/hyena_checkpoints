'use strict';

describe('Service: Checkpoint', function () {

  // load the service's module
  beforeEach(module('hyenaCheckpointsApp'));

  // instantiate service
  var Checkpoint;
  beforeEach(inject(function (_Checkpoint_) {
    Checkpoint = _Checkpoint_;
  }));

  it('should do something', function () {
    expect(!!Checkpoint).toBe(true);
  });

});
