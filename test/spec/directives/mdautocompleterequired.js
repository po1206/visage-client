'use strict';

describe('Directive: mdAutocompleteRequired', function () {

  // load the directive's module
  beforeEach(module('visageClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<md-autocomplete-required></md-autocomplete-required>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mdAutocompleteRequired directive');
  }));
});
