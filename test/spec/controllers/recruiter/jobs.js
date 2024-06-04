'use strict';

describe('Controller: RecruiterJobsCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var RecruiterJobsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecruiterJobsCtrl = $controller('RecruiterJobsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecruiterJobsCtrl.awesomeThings.length).toBe(3);
  });
});
