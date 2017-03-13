describe('component component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('component', function () {
      return {
        templateUrl: 'app/component.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<component></component>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
