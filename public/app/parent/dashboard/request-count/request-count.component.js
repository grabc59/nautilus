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
            var dataset = [{
                    "URL": "/route1",
                    "count": 156
                },
                {
                    "URL": "/index.html",
                    "count": 30
                },
                {
                    "URL": "/script.js",
                    "count": 50
                }
            ];
            var pie = d3.layout.pie()
                .value(function(d) {
                    return d.count
                });
            var color = d3.scale.category10();
            var w = 300;
            var h = 300;
            var outerRadius = w / 3;
            var innerRadius = w / 3 * .6;

            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            var svg = d3.select("#request-count")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
                // .style("background", "grey")
            var arcs = svg.selectAll("g.arc")
                .data(pie(dataset)) // pie-ify
                .enter() // for each datum
                .append("g") // create a g element
                .attr("class", "arc") // which will be an arc
                .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")"); // to size

            arcs.append("path")
                .attr("fill", function(d, i) {
                    return color(i); // generate pie arc color
                })
                .attr("d", arc);

            arcs.append("text")
                .attr("font-weight", "bold")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(function(d) {
                    return d.data.URL;
                });
        };
    }
}());
