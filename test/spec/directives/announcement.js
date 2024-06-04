'use strict';

describe('Directive: announcement', function () {

  // load the directive's module
  beforeEach(module('visageClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<announcement></announcement>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the announcement directive');
  }));
});
