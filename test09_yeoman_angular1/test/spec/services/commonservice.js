'use strict';

describe('Service: commonservice', function () {

  // load the service's module
  beforeEach(module('test09YeomanAngular1App'));

  // instantiate service
  var commonservice;
  beforeEach(inject(function (_commonservice_) {
    commonservice = _commonservice_;
  }));

  it('should do something', function () {
    expect(!!commonservice).toBe(true);
  });

});
