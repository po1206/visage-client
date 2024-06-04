'use strict';

describe('Service: Intercom', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var Intercom;
  beforeEach(inject(function (_Intercom_) {
    Intercom = _Intercom_;
  }));

  it('should do something', function () {
    expect(!!Intercom).toBe(true);
  });

});
