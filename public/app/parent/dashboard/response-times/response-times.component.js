(function() {
    'use strict';
    angular.module('app')
        .component('responseTimes', {
            controller: controller,
            templateUrl: `app/parent/dashboard/response-times/response-times.template.html`
        });
    controller.$inject = ['$stateParams', '$state', '$mdDialog'];

    function controller($stateParams, $state, $mdDialog) {
        const vm = this;
        vm.$onInit = function() {

            d3.xhr("/logs/response-times-data", function(err, data) {
                // created_at will look like this 2017-02-28T05:52:43.857Z
                // parse the JSON
                var d3DataArray = JSON.parse(data.responseText)
                var parseTime = d3.timeParse("%Y-%m-%dT%H");
                var averagedValuesArray = [];

                d3DataArray.forEach(function(element) {
                    // clean ms off the timestamp and convert for d3
                    let time = element.created_at;
                    let cleanedTime = time.slice(0, time.indexOf(":"));
                    element.created_at = parseTime(cleanedTime);
                });

                var padding = 50;
                var width = 300
                var height = 200
                var colorRange = d3.scale.category20c();
                var color = d3.scale.ordinal()
                    .range(colorRange.range());

                var svg = d3.select("#response-times")
                    .append("svg")
                    .attr("width", '100%')
                    .attr("height", '100%')
                    .attr("viewBox", "0 0 " + width + " " + height)
                    .attr('preserveAspectRatio', 'xMinYMin')

                // Nest the entries by url, dataNest will be used for the dropdown list
                vm.dataNest = d3.nest()
                    .key(function(d) {
                        return d.url;
                    })
                    .key(function(d) {
                        return d.created_at;
                    })
                    .rollup(function(leaves) {
                        let averagedValues = {
                            "created_at": leaves[0].created_at,
                            "response_time": d3.mean(leaves, function(d) {
                                return parseInt(d.response_time);
                            })
                        }
                        averagedValuesArray.push(averagedValues);
                        return averagedValues
                    })
                    .entries(d3DataArray)

                var x = d3.time.scale()
                    .domain(d3.extent(averagedValuesArray, function(d) {
                        return d.created_at;
                    }))
                    .rangeRound([padding, width - padding]);

                var y = d3.scale.linear()
                    .domain(d3.extent(averagedValuesArray, function(d) {
                        // console.log(d);
                        return d.response_time;
                    }))
                    .rangeRound([height - padding, padding]);



                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) {
                        return x(d.values.created_at);
                    })
                    .y(function(d) {
                        return y(d.values.response_time);
                    });

                svg.selectAll(".line")
                    .data(vm.dataNest)
                    .enter()
                    .append('path')
                    .attr('class', 'line')
                    //  .attr('id', function(d) {
                    // return d.key;})
                    .attr("stroke", function(d, i) {
                        return color(d.key);
                    })
                    .attr("d", line)
                    .attr("d", function(d) {
                        return line(d.values);
                    });

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(3)

                svg.append("g")
                    .attr("class", "axis x-axis")
                    .attr("transform", "translate(0," + (height - padding) + ")")
                    .transition()
                    .duration(1000)
                    .call(xAxis);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(function(d) {
                        return d;
                    })
                    .tickSize(5, 5, 0)
                    .ticks(5); // set rough # of ticks

                svg.append("g")
                    .attr("class", "axis y-axis")
                    .attr("transform", "translate(" + padding + ",0)")
                    .transition()
                    .duration(1000)
                    .call(yAxis);


                ///////////////////////////
                ///////// DROPDOWN
                ///////////////////////////

                // d3DataNest will be used by d3 as the data from dataNest that actually gets lines drawn
                vm.d3DataNest = [];

                // the dropdown functionality itself
                var originatorEv;
                vm.openMenu = function($mdOpenMenu, ev) {
                    originatorEv = ev;
                    $mdOpenMenu(ev);
                };

                vm.toggleSelection = function(n) {
                    // console.log(n, vm.dataNest.indexOf(n))
                    var idx = vm.d3DataNest.indexOf(n);

                    // upon turning the switch off, remove it from d3's array
                    if (idx > -1) {
                        vm.d3DataNest.splice(idx, 1);
                    }
                    // upon turning the switch on, push the url to the d3 data array to be rendered
                    else {
                        vm.d3DataNest.push(n);
                    }
                    console.log(vm.d3DataNest)
                }
            });


        };


    }
}());
