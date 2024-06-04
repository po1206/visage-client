'use strict';

describe('Directive: candidateProfile', function () {

  // load the directive's module
  beforeEach(module('visageClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<candidate-profile></candidate-profile>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the candidateProfile directive');
  }));
});
