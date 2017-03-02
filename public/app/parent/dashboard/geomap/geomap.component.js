(function() {
    'use strict';
    angular.module('app')
        .component('geomap', {
            controller: controller,
            templateUrl: `app/parent/dashboard/geomap/geomap.template.html`
        });
    controller.$inject = ['$stateParams', '$state'];

    function controller($stateParams, $state) {
        const vm = this;
        vm.$onInit = function() {

            var margin = {
                    top: 10,
                    left: 10,
                    bottom: 10,
                    right: 10
                },
                width = parseInt(d3.select('#geomap').style('width')),
                width = width - margin.left - margin.right,
                mapRatio = .5,
                height = width * mapRatio;
                console.log(width);

            var projection = d3.geo.albersUsa()
                .scale(width)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);


            var color = d3.scale.quantize()
                .range(["#41b6c4","#1d91c0","#225ea8","#253494"]);
            var svg = d3.select("#geomap")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("position","absolut")
                .attr("align", "center")


            d3.xhr("/logs/geomap-data", function(err, data) {
              var visits = JSON.parse(data.responseText);
              // console.log(visits);
              var geoMapData = {}
              for (var i = 0; i < visits.length; i++) {
                if (geoMapData.hasOwnProperty(visits[i].region_name)) {
                  geoMapData[visits[i].region_name]++;
                } else {
                  geoMapData[visits[i].region_name] = 1;
                }
              }

              color.domain([
                  d3.min(d3.values(geoMapData), function(d) {
                      return d;
                  }),
                  d3.max(d3.values(geoMapData), function(d) {
                      return d;
                  })
              ]);
              d3.json("/assets/data/us-states.json", function(json) {
                      for (var i = 0; i < json.features.length; i++) {
                        var jsonState = json.features[i].properties.name;
                        if (geoMapData.hasOwnProperty(jsonState)){
                          json.features[i].properties.value = geoMapData[jsonState];
                        }
                      }
                      svg.selectAll("path")
                          .data(json.features)
                          .enter()
                          .append("path")
                          .attr("d", path)
                          .style("fill", function(d) {
                              //Get data value
                              var value = d.properties.value;
                              if (value) {
                                  //If value exists…
                                  return color(value);
                              } else {
                                  //If value is undefined…
                                  return "#ccc";
                              }
                          });

                      /////// CREATE TOOLTIP
                      var geomapTooltip = d3.select("body").append("div").attr("class", "tooltip").attr("id", "geomap-tooltip");

                      /////// Helper function for displaying visits
                      function provideState(data) {
                          return data.properties.value || "None";
                      }
                      /////// CHART TOOLTIPS
                      var states = svg.selectAll("path");
                      states.on("mousemove", function(d){
                          geomapTooltip.style("left", d3.event.pageX+10+"px");
                          geomapTooltip.style("top", d3.event.pageY-25+"px");
                          geomapTooltip.style("display", "inline-block");
                          geomapTooltip.style("word-wrap", "break-word");
                          geomapTooltip.html("<strong>State: </strong>" +
                          (d.properties.name) + "<br>" + "<strong>Count: </strong>" + provideState(d))
                      })
                      states.on("mouseout", function(d){
                          geomapTooltip.style("display", "none");
                      });
                  });
            });
        };
    }
}());
