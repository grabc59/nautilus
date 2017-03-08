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
            }

            var mapRatio = .5

            // var width = ($('#geomap').width() || 200);
            // var height = $('#geomap').height() || 200 ;
            var width = 200;
            var height = 100;

            console.log(width, height)

            var projection = d3.geo.albersUsa()
                .translate([width / 2, height / 2])
                .scale(width)
            // .scale([500])

            var path = d3.geo.path()
                .projection(projection);


            var color = d3.scale.quantize()
                // .range(["#41b6c4", "#1d91c0", "#225ea8", "#253494"]);
                .range(["#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913"])
                // .range(["#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"])
            var svg = d3.select("#geomap")
                .append("svg")
                .attr("align", "center")
                .attr("width", '100%')
                .attr("height", '100%')
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr('preserveAspectRatio', 'xMinYMin')

            d3.xhr("/logs/geomap-data", function(err, data) {
                var visits = JSON.parse(data.responseText);
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
                        if (geoMapData.hasOwnProperty(jsonState)) {
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
                                return "rgba(36, 39, 42, 0.5)";
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
                    states.on("mousemove", function(d) {
                        geomapTooltip.style("left", d3.event.pageX + 10 + "px");
                        geomapTooltip.style("top", d3.event.pageY - 25 + "px");
                        geomapTooltip.style("display", "inline-block");
                        geomapTooltip.style("word-wrap", "break-word");
                        geomapTooltip.html("<strong>State: </strong>" +
                            (d.properties.name) + "<br>" + "<strong>Count: </strong>" + provideState(d))
                    })
                    states.on("mouseout", function(d) {
                        geomapTooltip.style("display", "none");
                    });
                });
            });
        };
    }
}());
