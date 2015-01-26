'use strict';

describe('Directive: selfValidation', function () {

  // load the directive's module
  beforeEach(module('hyenaCheckpointsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<self-validation></self-validation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the selfValidation directive');
  }));
});
