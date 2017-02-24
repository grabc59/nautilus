(function() {
  'use strict';
  angular.module('app')
  .component('cardList', {
    controller: controller,
    templateUrl: `app/dashboard/card-list/card-list.template.html`
 });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
      const vm = this;
      vm.$onInit = function() {
        console.log("card-list controller start");
      };
    }
}());
