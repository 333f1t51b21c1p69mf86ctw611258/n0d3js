function componentController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('component', {
    templateUrl: 'app/components/testcomp/component.html',
    controller: componentController
  });

