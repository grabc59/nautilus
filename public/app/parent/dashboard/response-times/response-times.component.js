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
              var parseTime = d3.timeParse("%Y-%m-%dT%H");
              var dateOccurrences = {}
              // var d3DataArray = [];

              d3DataArray.forEach(function(element) {
                // clean ms off the timestamp and convert for d3
                  let time = element.created_at;
                  let cleanedTime = time.slice(0, time.indexOf(":"));
                  element.created_at = parseTime(cleanedTime);
                  if (element.created_at ) {

                  }
              });
              // console.log(d3DataArray);

              // for (var i in dateOccurrences) {
              //     let d3DataObj = {}
              //     d3DataObj.time = parseTime(i);
              //     d3DataObj.count = dateOccurrences[i];
              //     d3DataObj.responseTime =
              //     d3DataArray.push(d3DataObj);
              // }

              var padding = 50;
              var svg = d3.select("#response-times")
                  .append("svg")

              var width = 300
              var height = 200

              svg.attr("viewBox", "0 0 " + width + " " + height)

              var x = d3.time.scale()
                  .domain(d3.extent(d3DataArray, function(d) {
                      return d.created_at;
                  }))
                  .rangeRound([padding, width - padding]);

              var y = d3.scale.linear()
                  .domain(d3.extent(d3DataArray, function(d) {
                      return d.response_time;
                  }))
                  .rangeRound([height - padding, padding]);

                  // console.log(d3.extent(d3DataArray, function(d) {
                  //     return d.response_time;
                  // }));



              var line = d3.svg.line()
                  .interpolate("basis")
                  .x(function(d) {
                      // console.log(d.values[0].created_at);
                      return x(d.created_at);
                  })
                  .y(function(d) {
                    // console.log(d.values[0].response_time);
                      return y(d.response_time);
                  });

              // Nest the entries by url
              var dataNest = d3.nest()
                  .key(function(d) {return d.url;})
                  .key(function(d) {return d.created_at;})
                  .rollup(function(leaves) {
                      return {
                          "response_time": d3.mean(leaves, function(d) {
                            // console.log(d)
                            return parseInt(d.response_time);
                          })
                      }
                  })
                  .entries(d3DataArray);
              // console.log(dataNest);

              svg.append("path")
                .attr("class", "line")
                .attr("d", line(dataNest[0].values))
                // .classed(dataNest[0].key, true);
                // dataNest.forEach(function(d) {
                //     // console.log(d);
                //     svg.append("path")
                //         .attr("class", "line")
                //         // .style("display", "none")
                //         .attr("d", line(d.values))
                //         .classed(d.key, true);
                // })

              var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  // .ticks(d3.time.days, 1);
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
