(function() {
  'use strict';
  angular.module('app')
  .component('navPanel', {
    controller: controller,
    templateUrl: `app/parent/nav-panel/nav-panel.template.html`
 });
    controller.$inject = ['$stateParams', '$state', '$scope', '$mdSidenav'];

    // function controller($stateParams, $state, $scope, $timeout, $mdSidenav) {
    function controller($stateParams, $state, $scope, $mdSidenav) {
      const vm = this;
      vm.$onInit = function() {
        $('.testing').css('color', 'red');
      };
      $scope.toggleLeft = buildToggler('left');

      function buildToggler(componentId) {
        return function() {
          $mdSidenav(componentId).toggle();
          // console.log('things')
        };
      }
    }

}());
