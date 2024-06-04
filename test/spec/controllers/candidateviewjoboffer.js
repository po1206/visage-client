'use strict';

describe('Controller: CandidateviewjobofferCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var CandidateviewjobofferCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CandidateviewjobofferCtrl = $controller('CandidateviewjobofferCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CandidateviewjobofferCtrl.awesomeThings.length).toBe(3);
  });
});
