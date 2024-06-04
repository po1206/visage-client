'use strict';

describe('Controller: EmployerReviewCvDialogCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var EmployerReviewCvDialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployerReviewCvDialogCtrl = $controller('EmployerReviewCvDialogCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmployerReviewCvDialogCtrl.awesomeThings.length).toBe(3);
  });
});
