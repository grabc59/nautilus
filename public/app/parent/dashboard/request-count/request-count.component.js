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
          // var margin = {
          //   top: 10,
          //   left: 10,
          //   bottom: 10,
          //   right: 10
          // }, width = parseInt(d3.select('#geomap').style('width')),
          // width = width - margin.left - margin.right,
          // ratio = .5,
          // height = width * ratio;

          //bostock's way of defining the svg dimensions
          var svg = d3.select("#request-count"),
              // .append("svg")
              // .attr("width", w)
              // .attr("height", h)
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.xhr("/logs", function(err, data) {
      // created_at will look like this 2017-02-28T05:52:43.857Z
              // parse the JSON
              console.log("got the data");
              var d3RequestData = [];
              var parsedData = JSON.parse(data.responseText)
              var parseTime = d3.timeParse("%d-%b-%y");
              var timeArray = [];
              var dateOccurrences = {}
              // console.log(d3RequestData);
              // filter for each created_at field
              parsedData.forEach(function(element) {
                let time = element.created_at;
                let cleanedTime = time.slice(0, time.indexOf(":"));
                timeArray.push(cleanedTime);
              });
              // console.log(timeArray);
              // count occurances of each time
              // timeArray.forEach(
              //
              // );
              // format the results for d3
            });
        };
    }
}());
