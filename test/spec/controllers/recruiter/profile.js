'use strict';

describe('Controller: RecruiterProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var RecruiterRecruiterprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecruiterRecruiterprofileCtrl = $controller('RecruiterProfileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecruiterRecruiterprofileCtrl.awesomeThings.length).toBe(3);
  });
});
