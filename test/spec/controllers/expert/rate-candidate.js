'use strict';

describe('Controller: ExpertRateCandidateCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var ExpertRateCandidateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExpertRateCandidateCtrl = $controller('ExpertRateCandidateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ExpertRateCandidateCtrl.awesomeThings.length).toBe(3);
  });
});
