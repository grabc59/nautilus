(function() {
  'use strict';

  angular.module('app')
  .component('dashboard', {
    controller: controller,
    templateUrl: `app/dashboard/dashboard.template.html`
 });
    controller.$inject = ['adsListService', '$stateParams', '$state'];

    function controller(adsListService, $stateParams, $state) {
      const vm = this;

      vm.$onInit = function() {
        console.log("edit-ad controller start");
        const adId = $stateParams.id;
        vm.getSpecificAd(adId);
      };
    }
}());
