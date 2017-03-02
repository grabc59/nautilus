(function() {
    'use strict';
    angular.module('app')
        .component('requestCount', {
            controller: controller,
            templateUrl: `app/parent/dashboard/request-count/request-count.template.html`
        });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
        const vm = this;
        vm.$onInit = function() {

            
        };
    }
}());
