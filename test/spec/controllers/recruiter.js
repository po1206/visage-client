'use strict';

describe('Controller: RecruiterCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var RecruiterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecruiterCtrl = $controller('RecruiterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecruiterCtrl.awesomeThings.length).toBe(3);
  });
});
