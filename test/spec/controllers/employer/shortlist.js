'use strict';

describe('Controller: EmployerShortlistCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var EmployerShortlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployerShortlistCtrl = $controller('EmployerShortlistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmployerShortlistCtrl.awesomeThings.length).toBe(3);
  });
});
