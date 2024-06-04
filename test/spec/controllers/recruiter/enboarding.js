'use strict';

describe('Controller: RecruiterEnboardingCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var RecruiterEnboardingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecruiterEnboardingCtrl = $controller('RecruiterEnboardingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecruiterEnboardingCtrl.awesomeThings.length).toBe(3);
  });
});
