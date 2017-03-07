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
              var averagedValuesArray = [];

              d3DataArray.forEach(function(element) {
                // clean ms off the timestamp and convert for d3
                  let time = element.created_at;
                  let cleanedTime = time.slice(0, time.indexOf(":"));
                  element.created_at = parseTime(cleanedTime);
                  if (element.created_at ) {

                  }
              });

              var padding = 50;
              var width = 300
              var height = 200

              var svg = d3.select("#response-times")
                  .append("svg")
                  .attr("width", '100%')
                  .attr("height", '100%')
                  .attr("viewBox", "0 0 " + width + " " + height)
                  .attr('preserveAspectRatio', 'xMinYMin')
                  
              // Nest the entries by url
              var dataNest = d3.nest()
                  .key(function(d) {return d.url;})
                  .key(function(d) {return d.created_at;})
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

              // dataNest.forEach(function (element) {
              //   element.values.forEach(function(value) {
              //     console.log(value)
              //     averagedValuesArray.push(value);
              //   })
              // })
              // console.log(averagedValuesArray);

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
                 .data(dataNest)
                 .enter()
                 .append('path')
                 .attr('class', 'line')
                 .attr('id', function(d) {
                  //  console.log(d);
                   return d.key;})
                 .attr("d", line)
                 .attr("d",function(d) {
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

          });
        };
    }
}());
