// --> CREATE SVG DRAWING AREA
var width = 800,
    height = 400;
//var margin = {top: 100, right: 100, bottom: 100, left: 100},
//    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
//    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
barWidth = width / 4;
barHeight = height;
formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".1f");

var barPadding = 5;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

var svgBar = d3.select("#ranking-area").append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight);

var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, ((height / 2)+50)])
    .precision(.1);;

var path = d3.geo.path()
    .projection(projection);

var x = d3.scale.linear()
    .domain([0, 5])
    .range([0, barWidth]);

var raw2007, raw2010, raw2012, raw2014 = {};
var allData = [];
var myAxes = {};
var myAllData = [];
var myAllArray = {};
var aspect = "Overall_LPI";

var quantize = d3.scale.quantize()
    //.domain([0, 100])
    .range(colorbrewer.Greens[9]);
//.map(function(i) { return "q" + i + "-9"; }));

//console.log(colorbrewer.Greens[9]);

// Initialize legend
var legend = d3.select('#legend')
    .append('ul')
    .attr('class', 'list-inline');

// Initialize tooltip
var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
    return "The " + d.Country + " is " + d.CustomsScore + " feet tall.";
});

// Use the Queue.js library to read the data files

queue()
    .defer(d3.csv, "data/International_LPI_from_2007.csv")
    .defer(d3.csv, "data/International_LPI_from_2010.csv")
    .defer(d3.csv, "data/International_LPI_from_2012.csv")
    .defer(d3.csv, "data/International_LPI_from_2014.csv")
    .defer(d3.json, "topojson/world-50m.json")
    .await(function (error, raw2007csv, raw2010csv, raw2012csv, raw2014csv, world) {

        // --> PROCESS DATA

        var dataYears = [raw2007csv, raw2010csv, raw2012csv, raw2014csv];
        var years = [2007, 2010, 2012, 2014];

        for (var i = 0; i < dataYears.length; i++) {
            dataYears[i].forEach(function (d) {
                d.Year = years[i]; // returns a Date
            });
            allData = allData.concat(dataYears[i]);
        }

        //myAxes=Object.keys(allData[0]);
        //variable this so you can use score or rank
        myAxes = Object.keys(allData[0]).filter(function (v) {
            return v.match(/Score/g);
        });

        // Update
        updateChoropleth(allData, 2014, world);
        $("#ranking-type").change(function(){
            updateChoropleth(allData, 2014, world);
        });
        updateBarChart(allData, 2014);

        //nonsense I'm working on SK
        var radarData = allData.filter(function (i) {
            //alert ($(this).text());
            //return (i.building == $(this).text());
            return (i.Year == 2007);
        });

        for (var i in radarData) {
            for (var key in radarData[i]) {
                if (radarData[i].hasOwnProperty(key)) {
                    myAllArray = $.map(radarData[i], function (value, index) {
                        if (value in myAxes) {
                            return {value};
                        }
                    });
                }
            }
            myAllData.push(myAllArray);
        }

        //Call function to draw the Radar chart
        RadarChart(".radarChart", myAllData, radarChartOptions);

    });

function updateChoropleth(dataset, year, world) {

    var mapData = dataset.filter(function (i) {
        //alert ($(this).text());
        //return (i.building == $(this).text());
        return (i.Year == year);
    });

    var mapDataByID = [];
    for (var i = 0; i < mapData.length; i++) {
        mapDataByID[mapData[i].ID] = mapData[i];
    }

    // --> Choropleth implementation
    var selectBox1 = document.getElementById("ranking-type");
    var aspect = selectBox1.options[selectBox1.selectedIndex].value;

    quantize.domain(d3.extent(mapData, function (d) {
        return +d[aspect + "Score"]
    }));

    // Render legend
    var keys = legend.selectAll('li')
        .data(quantize.range());

    keys.attr("class", "update key")
        .text(function (d) {
        var r = quantize.invertExtent(d);
        return formatNumber(r[0]);
        });

    keys.enter().append('li')
        .attr("class", "enter key")
        .style('border-top-color', String)
        .text(function (d) {
            var r = quantize.invertExtent(d);
            return formatNumber(r[0]);
        });

    keys.exit()
       .attr("opacity", 1)
       .transition()
       .duration(1000)
       .attr("opacity", 0)
       .remove();


    // Render the world by using the path generator & Bostock https://bl.ocks.org/mbostock/4060606
    var worldMap = svg.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features);

    worldMap.attr("class", "update")
        .style("fill", function (d) {
            return quantize(findAspect(mapDataByID, d.id, aspect + "Score"));
        });

    worldMap.enter().append("path")
        .attr("d", path)
        .style("fill", function (d) {
            return quantize(findAspect(mapDataByID, d.id, aspect + "Score"));
        });

    worldMap.exit().remove();

}

function findAspect(data, ID, aspect) {
    console.log(aspect);
    if (typeof data[ID] === "undefined") {
        //console.log('the property is not available...'); // print into console
        return null;
    } else {
        return data[ID][aspect];
    }
}

function updateBarChart(dataset, year) {

    var chartData = dataset.filter(function (i) {
        //alert ($(this).text());
        //return (i.building == $(this).text());
        return (i.Year == year);
    });

    //console.log(chartData.length)

    chartData.sort(function (a, b) {
        return a.CustomsRank - b.CustomsRank;
    });

    //console.log(chartData);

    svgBar.selectAll("rect")
        .data(chartData)
        .enter()
        .append("rect")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("fill", "grey")
        .attr("y", function (d, i) {
            //console.log(d.id)
            return (i * (barHeight / chartData.length)) + barPadding;
        })
        .attr("x", barPadding)
        .attr("height", (barHeight / chartData.length) - 1)
        .attr("width", function (d) {
            //console.log(d.Code);
            return x(d.CustomsScore);
        })
        .append("text")
        .attr("class", "bartext")
        .attr("text-anchor", "end")
        .attr("fill", "blue")
        .text(function (d) {
            return d.CustomsRank;
        })
        .append("p")
        .attr("id", function (d) {
            return d.Code;
        })
        .html(function (d) {
            return "<h3>" + d.CustomsRank + "</h3><br>Height " + d.Country + "<br>City " + d.Rank + "<br>Country " + d.TimelinessRank + "<br>Floors " + d.TimelinessScore + "<br>Completed " + d.CustomsScore;
        });
    // Invoke tooltip
    svgBar.call(tip)

}