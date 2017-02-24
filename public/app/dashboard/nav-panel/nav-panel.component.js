(function() {
  'use strict';
  angular.module('app')
  .component('navPanel', {
    controller: controller,
    templateUrl: `app/dashboard/nav-panel/nav-panel.template.html`
 });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
      const vm = this;
      vm.$onInit = function() {
        console.log("nav-panel controller start");
      };
    }
}());
