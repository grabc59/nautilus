(function() {
    'use strict';
    angular.module('app')
        .component('topIps', {
            controller: controller,
            templateUrl: `app/parent/dashboard/top-ips/top-ips.template.html`
        });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
        const vm = this;
        vm.$onInit = function() {
            
        };
    }
}());
