(function() {
  'use strict';
  angular.module('app')
  .component('navPanel', {
    controller: controller,
    templateUrl: `app/dashboard/nav-panel/nav-panel.template.html`
 });
    controller.$inject = ['$stateParams', '$state', '$scope', '$mdSidenav'];

    // function controller($stateParams, $state, $scope, $timeout, $mdSidenav) {
    function controller($stateParams, $state, $scope, $mdSidenav) {
      const vm = this;
      vm.$onInit = function() {
        console.log("nav-panel controller start");
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
