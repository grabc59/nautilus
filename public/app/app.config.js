(function() {
  'use strict';

  angular.module('app').config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
    .state({
      name: 'dashboard',
      url: '/',
      component: 'dashboard',
    })
    .state({
      name: 'geomap',
      url: '/geomap',
      component: 'geomap',
    })
    .state({
      name: 'topRoutes',
      url: '/top-routes',
      component: 'topRoutes',
    })
    .state({
      name: 'requestCount',
      url: '/request-count',
      component: 'requestCount',
    })
    .state({
      name: 'responseTimes',
      url: '/request-times',
      component: 'responseTimes',
    })
  }
}());
