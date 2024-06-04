'use strict';

describe('Directive: candidateListAndDetail', function () {

  // load the directive's module
  beforeEach(module('visageClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<candidate-list-and-detail></candidate-list-and-detail>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the candidateListAndDetail directive');
  }));
});
