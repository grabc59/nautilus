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
            // var margin = {
            //   top: 10,
            //   left: 10,
            //   bottom: 10,
            //   right: 10
            // }, width = parseInt(d3.select('#geomap').style('width')),
            // width = width - margin.left - margin.right,
            // ratio = .5,
            // height = width * ratio;



            d3.xhr("/logs", function(err, data) {
                // created_at will look like this 2017-02-28T05:52:43.857Z
                // parse the JSON
                var parsedData = JSON.parse(data.responseText)
                var parseTime = d3.timeParse("%Y-%m-%d");
                var dateOccurrences = {}
                var d3DataArray = [];

                parsedData.forEach(function(element) {
                    // filter for each created_at field
                    let time = element.created_at;
                    let cleanedTime = time.slice(0, time.indexOf("T"));
                    // count occurances of each time
                    if (dateOccurrences.hasOwnProperty(cleanedTime)) {
                        dateOccurrences[cleanedTime]++;
                    } else {
                        dateOccurrences[cleanedTime] = 1;
                    }
                });

                for (var i in dateOccurrences) {
                    let d3DataObj = {}
                    d3DataObj.time = parseTime(i);
                    d3DataObj.count = dateOccurrences[i];
                    d3DataArray.push(d3DataObj);
                }

                var padding = 50;
                var svg = d3.select("#request-count")
                    .append("svg")

                // var margin = {
                //         top: 20,
                //         right: 20,
                //         bottom: 30,
                //         left: 50
                //     },
                    var width = 300
                    var height = 200

                // svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                // .attr("width", width)
                // .attr("height", height)
                svg.attr("viewBox", "0 0 " + width + " " + height)

                var x = d3.time.scale()
                    .domain(d3.extent(d3DataArray, function(d) {
                        return d.time;
                    }))
                    .rangeRound([padding, width - padding]);

                var y = d3.scale.linear()
                    .domain(d3.extent(d3DataArray, function(d) {
                        return d.count;
                    }))
                    .rangeRound([height - padding, padding]);

                var line = d3.svg.line()
                    .x(function(d) {
                        return x(d.time);
                    })
                    .y(function(d) {
                        return y(d.count);
                    });

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    // .ticks(d3.time.days, 1);
                    .ticks(5)

                svg.append("g")
                    .attr("class", "axis x-axis")
                    .attr("transform", "translate(0," + (height - padding) + ")")
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
                    .call(yAxis);

                svg.append("path").attr("d", line(d3DataArray));

            });
        };
    }
}());
