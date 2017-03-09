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

            d3.xhr("/logs", function(err, data) {
                // created_at will look like this 2017-02-28T05:52:43.857Z
                // parse the JSON
                var parsedData = JSON.parse(data.responseText)
                var parseTime = d3.timeParse("%Y-%m-%dT%H");
                var dateOccurrences = {}
                var d3DataArray = [];
                // for tooltips - d3.bisector can find a value in an ordered array
                var bisectDate = d3.bisector(function(d) {
                  return d.time;
                }).left;

                parsedData.forEach(function(element) {
                    // filter for each created_at field
                    let time = element.created_at;
                    let cleanedTime = time.slice(0, time.indexOf(":"));
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
                var width = 300
                var height = 200

                var svg = d3.select("#request-count")
                    .append("svg")
                    .attr("width", '100%')
                    .attr("height", '100%')
                    .attr("viewBox", "0 0 " + width + " " + height)
                    .attr('preserveAspectRatio', 'xMinYMin')

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

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(d3.time.days, 1)
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



                /////////////////////
                /////// THE LINE
                /////////////////////

                var valueline = d3.svg.line()
                    .interpolate("monotone")
                    .x(function(d) { return x(d.time); })
                    .y(function(d) { return y(d.count); });

                var lineSvg = svg.append("g");
                var path = lineSvg.append("path")
                  .attr("class", "line")
                  .attr("d", valueline(d3DataArray));

                var totalLength = path.node().getTotalLength();

                path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

                /////////////////////
                /////// TOOLTIPS
                /////////////////////

                /////// Adding the circle to the graph
                var focus = svg.append("g")
                    .style("display", "none");

                focus.append("circle")
                        .attr("class", "y")
                        .style("fill", "none")
                        .style("stroke", "blue")
                        .attr("r", 4);


                focus.append("div")
                    .attr("class", "tooltip")
                    .attr("id", "request-count-tooltip")

                /////// CREATE TOOLTIP
                var requestCountTooltip = d3.select("request-count").append("div").attr("class", "tooltip").attr("id", "request-count-tooltip");

                /////// Set the area that we use to capture our mouse movements
                svg.append("rect")
                .attr("width", '100%')
                .attr("height", '100%')
                   .style("fill", "none")
                   .style("pointer-events", "all")
                   .on("mouseover", function() { focus.style("display", null); })
                   .on("mouseout", function() {
                     requestCountTooltip.style("display", "none");
                     focus.style("display", "none");
                   })
                   .on("mousemove", mousemove);

                   function mousemove() {
                     /////// DETERMINING WHICH DATE WILL BE HIGHLIGHTED
                      // determine the mouse's x coordinate
                       var x0 = x.invert(d3.mouse(this)[0]),
                        // find the index of the x axis value (date) closest to the mouse
                          i = bisectDate(d3DataArray, x0, 1),
                          // the value pair to the left of the mouse
                          d0 = d3DataArray[i - 1],
                          // the value pair to the right of the mouse
                          d1 = d3DataArray[i],
                          // the value pair closest to the mouse
                          d = x0 - d0.time > d1.time - x0 ? d1 : d0;

                      ////// move the circle to the position of the mouse
                       focus.select("circle.y")
                           .attr("transform",
                              "translate(" + x(d.time) + "," + y(d.count) + ")");

                        requestCountTooltip.style("left", d3.event.pageX+10+"px");
                        requestCountTooltip.style("top", d3.event.pageY-25+"px");
                        // console.log(requestCountTooltip.style("left", d3.event.pageX+10+"px"));
                        requestCountTooltip.style("display", "inline-block");
                        requestCountTooltip.style("word-wrap", "break-word");
                        requestCountTooltip.html("<strong>URL: </strong>" + (d.time)+"<br>"+"<strong>Count: </strong>" + (d.count));
                   }
            });
        };
    }
}());
