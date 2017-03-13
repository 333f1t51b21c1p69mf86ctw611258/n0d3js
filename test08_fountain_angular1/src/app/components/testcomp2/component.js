function componentController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('component', {
    templateUrl: 'app/components/testcomp2/component.html',
    controller: componentController
  });

