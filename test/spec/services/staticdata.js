'use strict';

describe('Service: StaticData', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var StaticData;
  beforeEach(inject(function (_StaticData_) {
    StaticData = _StaticData_;
  }));

  it('should do something', function () {
    expect(!!StaticData).toBe(true);
  });

});
