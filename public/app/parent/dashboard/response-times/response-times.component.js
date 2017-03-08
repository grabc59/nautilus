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
              var colorRange = d3.scale.category20c();
              var color = d3.scale.ordinal()
                            .range(colorRange.range());

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
                  // .slice(0, 10)

              console.log(dataNest);

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
                //  .attr('id', function(d) {
                    // return d.key;})
                 .attr("stroke", function(d, i) {
                    return color(d.key);
                 })
                 .attr("d", line)
                 .attr("d",function(d) {
                   return line(d.values);
                 });

                 ///// line animations
                //  var totalLength = path.node().getTotalLength();
                 //
                //  path
                //  .attr("stroke-dasharray", totalLength + " " + totalLength)
                //  .attr("stroke-dashoffset", totalLength)
                //  .transition()
                //  .duration(1000)
                //  .ease("linear")
                //  .attr("stroke-dashoffset", 0);
                function animatelines(whichline) {

                				// Look at what button was clicked
                				if(whichline == 0 ){

                				// First set all the lines to be invisible
                				d3.selectAll(".line").style("opacity","0");

                				// Then highlight the main line to be fully visable and give it a thicker stroke
                				d3.select("#line0").style("opacity","1").style("stroke-width",4);

                				// First work our the total length of the line
                				var totalLength = d3.select("#line0").node().getTotalLength();

                				d3.selectAll("#line0")
                				  // Set the line pattern to be an long line followed by an equally long gap
                				  .attr("stroke-dasharray", totalLength + " " + totalLength)
                				  // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
                				  .attr("stroke-dashoffset", totalLength)
                				  // Then the following lines transition the line so that the gap is hidden...
                				  .transition()
                				  .duration(5000)
                				  .ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
                				  .attr("stroke-dashoffset", 0);

                			  }
                			 else if(whichline == 1){

                				d3.selectAll(".line").style("opacity","0.5");
                        
                				//Select All of the lines and process them one by one
                				d3.selectAll(".line").each(function(d,i){

                				// Get the length of each line in turn
                				var totalLength = d3.select("#line" + i).node().getTotalLength();

                					d3.selectAll("#line" + i).attr("stroke-dasharray", totalLength + " " + totalLength)
                					  .attr("stroke-dashoffset", totalLength)
                					  .transition()
                					  .duration(5000)
                					  .delay(100*i)
                					  .ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
                					  .attr("stroke-dashoffset", 0)
                					  .style("stroke-width",3)
                				})
                			 }
                	  }




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

                  //////// LEGEND
                  // var topRoutesLegendContainer = d3.select("#response-times")
                  //   .append("div")
                  //   .attr("width", width)
                  //   .attr("height", "50px")
                  //   .attr("class", "legend-container")
                  //   .attr("id", "response-times-legend-container")
                  //
                  // var legend = topRoutesLegendContainer.selectAll('.legend')
                  //     .data(color.domain())
                  //     .enter()
                  //     .append('g')
                  //     .attr('class', 'legend')
                  //
                  // legend.append('div')
                  //   .text(function(d) {
                  //     return d;
                  //   })
                  //   .style("color", color)

          });
        };
    }
}());
