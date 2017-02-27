(function() {
  'use strict';
  angular.module('app')
  .component('topBar', {
    controller: controller,
    templateUrl: `app/parent/top-bar/top-bar.template.html`
 });
    controller.$inject = ['$stateParams', '$state', '$scope'];
    
    function controller($stateParams, $state, $scope) {
      const vm = this;
      vm.$onInit = function() {
        console.log("top-bar controller start");
      };

    }

}());
