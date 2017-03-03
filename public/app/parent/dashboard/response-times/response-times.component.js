(function() {
    'use strict';
    angular.module('app')
        .component('responseTimes', {
            controller: controller,
            templateUrl: `app/parent/dashboard/response-times/response-times.template.html`
        });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
        const vm = this;
        vm.$onInit = function() {

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
              var svg = d3.select("#response-times")
                  .append("svg")

              var width = 300
              var height = 200

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
                  .interpolate("basis")
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

              var path = svg
                .append("path")
                .attr("d", line(d3DataArray));

              var totalLength = path.node().getTotalLength();

                  path
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(1000)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);

          });



        };
    }
}());
