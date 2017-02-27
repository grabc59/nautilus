(function() {
  'use strict';
  angular.module('app')
  .component('parent', {
    controller: controller,
    templateUrl: `app/parent/parent.template.html`
 });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
      const vm = this;
      vm.$onInit = function() {
        console.log("dashboard controller start");
      };
    }
}());
