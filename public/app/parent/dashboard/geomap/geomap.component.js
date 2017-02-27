(function() {
    'use strict';
    angular.module('app')
        .component('geomap', {
            controller: controller,
            templateUrl: `app/parent/dashboard/geomap/geomap.template.html`
        });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
        const vm = this;
        vm.$onInit = function() {
          // var w = 500;
	        // var h = 300;

          var margin = {top: 10, left: 10, bottom: 10, right: 10}
          , width = parseInt(d3.select('#geomap').style('width'))
          , width = width - margin.left - margin.right
          , mapRatio = .5
          , height = width * mapRatio;

          console.log(width);

          var projection = d3.geo.albersUsa()
              .scale(width)
              .translate([width / 2, height / 2]);

          var path = d3.geo.path()
              .projection(projection);

          var svg = d3.select("#geomap")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
          // var path = d3.geo.path();


          d3.json("/assets/data/us-states.json", function(json) {

          svg.selectAll("path")
             .data(json.features)
             .enter()
             .append("path")
             .attr("d", path);
          });
        };
    }
}());
