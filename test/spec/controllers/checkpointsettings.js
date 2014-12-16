'use strict';

describe('Controller: CheckpointsettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('hyenaCheckpointsApp'));

  var CheckpointsettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CheckpointsettingsCtrl = $controller('CheckpointsettingsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
