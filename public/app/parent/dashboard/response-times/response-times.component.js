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

          d3.xhr("/logs/response-times-data", function(err, data) {
              // created_at will look like this 2017-02-28T05:52:43.857Z
              // parse the JSON
              var d3DataArray = JSON.parse(data.responseText)

              ////// PREP THE DATA FOR D3
              var nestedData = d3.nest()
                .key(function(d) { return d.url; })
                .rollup(function(leaves) {
                  return {
                    "response_time": d3.mean(leaves, function(d) {
                      return parseInt(d.response_time);
                    })
                  }
                })
                .entries(d3DataArray)
                .sort(function(a, b){
                  return d3.descending(a.values.response_time, b.values.response_time); })

                var urlList = [];
                nestedData.forEach(function(element, i) {
                  if (i<5){
                    urlList.push(element.key);
                  }
                })

              ////// DRAW THE GRAPH
              var width = 600
              var height = 250
              var padding = 50;
              var svg = d3.select("#response-times")
                  .style("overflow-x", "scroll")
                  .append("svg")
                  .style("overflow-x", "scroll")
                  .style("width", width)
              // svg.attr("viewBox", "0 40 " + width + " " + height)
              svg.attr("viewBox", "0 40 " + width + " " + height)


              var x = d3.scale.ordinal()
                  .domain(urlList)
                  .rangePoints([padding, width]);;

              var y = d3.scale.linear()
                  .domain(d3.extent(d3DataArray, function(d) {
                      return d.response_time;
                  }))
                  .rangeRound([height - padding, padding]);

              var line = d3.svg.line()
                  .interpolate("basis")
                  .x(function(d) {
                      // console.log(d);
                      return x(d.created_at);
                  })
                  .y(function(d) {
                      return y(d.response_time);
                  });

              var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .ticks(5);

              svg.append("g")
                  .attr("class", "axis x-axis")
                  .attr("transform", "translate(0," + (height - padding) + ")")
                  .transition()
                  .duration(1000)
                  .call(xAxis)
                  .selectAll("text")
                   .style("text-anchor", "end")
                   .attr("dx", "-.8em")
                   .attr("dy", ".15em")
                   .attr("transform", "rotate(-65)" );

              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .tickFormat(function(d) {
                      return d;
                  })
                  // .tickSize(5, 5, 0)
                  .ticks(5); // set rough # of ticks

              svg.append("g")
                  .attr("class", "axis y-axis")
                  .attr("transform", "translate(" + padding + ",0)")
                  .transition()
                  .duration(1000)
                  .call(yAxis);

              // var path = svg
              //   .append("path")
              //   .attr("d", line(d3DataArray));

              // var totalLength = path.node().getTotalLength();
              //     path
              //       .attr("stroke-dasharray", totalLength + " " + totalLength)
              //       .attr("stroke-dashoffset", totalLength)
              //       .transition()
              //       .duration(1000)
              //       .ease("linear")
              //       .attr("stroke-dashoffset", 0);

          });



        };
    }
}());
