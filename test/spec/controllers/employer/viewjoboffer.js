'use strict';

describe('Controller: EmployerViewjobofferCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var EmployerViewjobofferCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployerViewjobofferCtrl = $controller('EmployerViewjobofferCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmployerViewjobofferCtrl.awesomeThings.length).toBe(3);
  });
});
