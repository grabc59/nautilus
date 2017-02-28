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

            var projection = d3.geo.albersUsa()
                .scale(width)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);


            var color = d3.scale.quantize()
                .range(["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"]);

            var svg = d3.select("#geomap")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

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
              console.log(geoMapData);
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
                  });

            });
            //  d3.csv("/assets/data/us-ag-productivity-2004.csv", function(data) {
            //     color.domain([
            //         d3.min(data, function(d) {
            //             return d.value;
            //         }),
            //         d3.max(data, function(d) {
            //             return d.value;
            //         })
            //     ]);
            //
            //     d3.json("/assets/data/us-states.json", function(json) {
            //         for (var i = 0; i < data.length; i++) {
            //             var dataState = data[i].state;
            //             var dataValue = parseFloat(data[i].value);
            //             for (var j = 0; j < json.features.length; j++) {
            //                 var jsonState = json.features[j].properties.name;
            //                 if (dataState == jsonState) {
            //                     json.features[j].properties.value = dataValue;
            //                     break;
            //                 }
            //             }
            //         }
            //         svg.selectAll("path")
            //             .data(json.features)
            //             .enter()
            //             .append("path")
            //             .attr("d", path)
            //             .style("fill", function(d) {
            //                 //Get data value
            //                 var value = d.properties.value;
            //
            //                 if (value) {
            //                     //If value exists…
            //                     return color(value);
            //                 } else {
            //                     //If value is undefined…
            //                     return "#ccc";
            //                 }
            //             });
            //     });
            // });
        };
    }
}());
