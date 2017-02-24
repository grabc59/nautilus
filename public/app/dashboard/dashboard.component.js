(function() {
  'use strict';
  angular.module('app')
  .component('dashboard', {
    controller: controller,
    templateUrl: `app/dashboard/dashboard.template.html`
 });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
      const vm = this;
      vm.$onInit = function() {
        console.log("dashboard controller start");
      };
    }
}());
