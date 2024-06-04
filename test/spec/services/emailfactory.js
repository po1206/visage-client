'use strict';

describe('Service: EMailFactory', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var EMailFactory;
  beforeEach(inject(function (_EMailFactory_) {
    EMailFactory = _EMailFactory_;
  }));

  it('should do something', function () {
    expect(!!EMailFactory).toBe(true);
  });

});
