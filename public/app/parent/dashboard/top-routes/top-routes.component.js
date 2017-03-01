(function() {
    'use strict';
    angular.module('app')
        .component('topRoutes', {
            controller: controller,
            templateUrl: `app/parent/dashboard/top-routes/top-routes.template.html`
        });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
        const vm = this;

        vm.$onInit = function() {

          ////////////////////////////
          /////// HELPER FUNCTIONS
          ////////////////////////////
          /////// count occurances of each item in the requested data
          function countDataOccurances(jsonData, property1) {
            var occurancesObj = {};
            var array = JSON.parse(jsonData.responseText);
            for (var i = 0; i < array.length; i++) {
              if (occurancesObj.hasOwnProperty(array[i][property1])) {
                occurancesObj[array[i][property1]]++;
              } else {
                occurancesObj[array[i][property1]] = 1;
              }
            }
            return occurancesObj
          }
          /////// prep the data count so D3 can easily read it
          function convertDataCountObjForD3(dataOccurances, propertyBeingCounted, resultPropertyName) {
            var d3DataArray = [];
            for (var i in dataOccurances) {
              let d3DataObj = {}
              d3DataObj[propertyBeingCounted] = i;
              d3DataObj[resultPropertyName] = dataOccurances[i];
              d3DataArray.push(d3DataObj);
            }
            return d3DataArray;
          }



          /////// CREATE TOOLTIP
          var topRoutesTooltip = d3.select("body").append("div").attr("class", "tooltip").attr("id", "top-routes-tooltip");

          /////// REQUEST DATA
          d3.xhr("/logs/top-routes", function(err, data) {

            ////// PREP REQUESTED DATA FOR D3
            var d3RouteData = convertDataCountObjForD3(countDataOccurances(data, "url"), "url", "count" )
            ////////////////////////////
            /////// DRAW THE PIE CHART
            ////////////////////////////
            var topRoutesPie = d3.layout.pie()
                .startAngle(1.1*Math.PI)
                .endAngle(3.1*Math.PI)
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

            var topRoutesSvg = d3.select("#top-routes")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            var arcs = topRoutesSvg.selectAll("g.arc")
                .data(topRoutesPie(d3RouteData)) // pie-ify
                .enter() // for each datum
                .append("g") // create a g element
                .attr("class", "arc") // which will be an arc
                .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")") // to size

            arcs.append("path")
                .attr("fill", function(d, i) {
                    return color(i); // generate pie arc color
                })
                .transition()
                  .ease("exp")
                  .duration(1000)
                  .attrTween("d", tweenPie)
                  
            /////// CHART LABELS
            arcs.on("mousemove", function(d){
                topRoutesTooltip.style("left", d3.event.pageX+10+"px");
                topRoutesTooltip.style("top", d3.event.pageY-25+"px");
                topRoutesTooltip.style("display", "inline-block");
                topRoutesTooltip.style("word-wrap", "break-word");
                topRoutesTooltip.html("<strong>URL: </strong>" + (d.data.url)+"<br>"+"<strong>Count: </strong>" + (d.data.count));
            });
            arcs.on("mouseout", function(d){
                topRoutesTooltip.style("display", "none");
            });

            function tweenPie(b) {
              var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
              return function(t) { return arc(i(t)); };
            }
          });
        };
    }
}());
