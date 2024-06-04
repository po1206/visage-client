'use strict';

describe('Controller: PreviewcvCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var PreviewcvCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreviewcvCtrl = $controller('PreviewcvCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreviewcvCtrl.awesomeThings.length).toBe(3);
  });
});
