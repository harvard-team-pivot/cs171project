// // --> CREATE SVG DRAWING AREA
// var width = 1000,
//     height = 1000;
// formatPercent = d3.format(".0%"),
//     formatNumber = d3.format(".0f");

// var margin = {top: 40, right: 40, bottom: 60, left: 60};

// var svg2 = d3.select("#chart2-area").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var malariaFunding = [];

// // Use the Queue.js library to read two files

// queue()
//     .defer(d3.csv, "data/global-funding.csv")
//     .await(function (error, malariaFundingCSV) {

//         //console.log(mapTopJson);
//         //console.log(malariaDataCsv);

//         // --> PROCESS DATA

//         //malariaData2 = malariaDataCsv2;
//         // TODO filtered data was removing mediterranean countries
//         malariaFundingCSV.forEach(function (d) {
//             //Convert numeric values to 'numbers'
//             d["2005"] = +d["2005"];
//             d["2006"] = +d["2006"];
//             d["2007"] = +d["2007"];
//             d["2008"] = +d["2008"];
//             d["2009"] = +d["2009"];
//             d["2010"] = +d["2010"];
//             d["2011"] = +d["2011"];
//             d["2012"] = +d["2012"];
//             d["2013"] = +d["2013"];
//             //for each(i = 0, Object.keys(malariaFundingCSV[0]).length, i++) {
//             //    d["source"] = d["source"]
//             //        +d["2005"];

//             //d["2005"] = +d["2005"];
//             //d["2006"] = +d["2006"];
//             //d["2007"] = +d["2007"];
//             //d["2008"] = +d["2008"];
//             //d["2009"] = +d["2009"];
//             //d["2010"] = +d["2010"];
//             //d["2011"] = +d["2011"];
//             //d["2012"] = +d["2012"];
//             //d["2013"] = +d["2013"];
//             //}
//         });

//         malariaFunding = malariaFundingCSV;

//         //console.log(malariaFundingCSV);

//         // Update choropleth
//         updateVisualization();
//     });

// function updateVisualization() {

//     // Scales
//     var x = d3.scale.ordinal()
//         .rangeRoundBands([0, width - margin.right], .1)
//         .domain([2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013]);
//     //Object.keys(malariaFunding[0])

//     var y = d3.scale.linear()
//         .range([height, 0])
//         .domain([0, d3.max(malariaFunding, function (d) {
//             return +d["2013"];
//         })]);

//     // Create an X axis function
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom");

//     // setup fill color
//     var cValue = function (malariaFunding) {
//             return malariaFunding.Source;
//         },
//         color = d3.scale.category10();

// // Create a Y axis function
//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left");
// // Draw the x axis
//     svg2.append("g")
//         .transition()
//         .attr("class", "axis x-axis")
//         .attr("transform", "translate(" + margin.bottom + "," + (height - 20) + ")")
//         .call(xAxis);

//     svg2.selectAll("y-axis", "text-anchor middle")
//         .remove();

// // draw the y axis
//     svg2.append("g")
//         .attr("class", "axis y-axis")
//         .attr("transform", "translate(" + margin.bottom + ",-20)")
//         .call(yAxis);

//     svg2.selectAll("g .x-axis text")  // select all the text elements for the xaxis
//         .transition()
//         .duration(3000)
//         .attr("transform", function (d) {
//             return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")";
//         });

// // now add titles to the axes
//     svg2.append("text")
//         .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
//         .attr("transform", "translate(" + (margin.left / 2) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
//         .text("Funding");

//     svg2.append("text")
//         .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
//         .attr("transform", "translate(" + (width / 2) + "," + (height + (margin.bottom / 2)) + ")")  // centre below axis
//         .text("Year");

//     // draw dots
//     svg2.selectAll(".dot")
//         .data(malariaFunding)
//         .enter().append("circle")
//         .attr("class", "dot")
//         .attr("r", 3.5)
//         .attr("cx", x(2008))
//         .attr("cy", y(function (d) {
//             return +d["2008"]
//         }))
//         .style("fill", function (d) {
//             return color(cValue(d))
//         });
//     //.on("mouseover", function(d) {
//     //    tooltip.transition()
//     //        .duration(200)
//     //        .style("opacity", .9);
//     //    tooltip.html(d["2012"] + "<br/> (" + xAxis(d)
//     //            + ", " + yAxis(d) + ")")
//     //        .style("left", (d3.event.pageX + 5) + "px")
//     //        .style("top", (d3.event.pageY - 28) + "px");
//     //})
//     //.on("mouseout", function(d) {
//     //    tooltip.transition()
//     //        .duration(500)
//     //        .style("opacity", 0);
//     //});

//     // draw legend
//     var legend = svg2.selectAll(".legend")
//         .data(color.domain())
//         .enter().append("g")
//         .attr("class", "legend")
//         .attr("transform", function (d, i) {
//             return "translate(0," + i * 20 + ")";
//         });

//     // draw legend colored rectangles
//     legend.append("rect")
//         .attr("x", width - 18)
//         .attr("width", 18)
//         .attr("height", 18)
//         .style("fill", color);

//     // draw legend text
//     legend.append("text")
//         .attr("x", width - 24)
//         .attr("y", 9)
//         .attr("dy", ".35em")
//         .style("text-anchor", "end")
//         .text(function (d) {
//             return d;
//         });
// }

// function transpose(a) {
//     return Object.keys(a[0]).map(
//         function (c) { return a.map(function (r) { return r[c]; }); }
//     );
// }