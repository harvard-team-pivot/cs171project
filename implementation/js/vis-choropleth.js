// --> CREATE SVG DRAWING AREA
var width = 1000,
    height = 800;
    barWidth = width/3;
    barHeight = height/3;
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
    .translate([width / 2, height / 2])
    //.center(20)
    .scale([140]);

var projection = d3.geo.equirectangular()
    .translate([width / 2, height / 2])
    //.center(20)
    .scale([250]);

var path = d3.geo.path()
    .projection(projection);

var x = d3.scale.linear()
    .domain([0,5])
    .range([0, barWidth]);

var raw2007, raw2010, raw2012, raw2014 = {};
var allData = [];

var aspect = "Overall_LPI";

var quantize = d3.scale.quantize()
    //.domain([0, 100])
    .range(colorbrewer.Greens[9]);
//.map(function(i) { return "q" + i + "-9"; }));

//console.log(colorbrewer.Greens[9]);

var malariaDataByCountryId = [];

// Initialize tooltip
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    return "The " + d.Country + " is " + d.CustomsScore + " feet tall." ;
});

// Use the Queue.js library to read two files

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

        var dataYears2014 = [];

        for (var i = 0; i < dataYears[3].length; i++) {
            dataYears2014[dataYears[3][i].ID] = dataYears[3][i];
        }

        // Update choropleth
        updateChoropleth(dataYears2014, world);
        updateBarChart(allData, 2014);
    });

//d3.select("#ranking-type").on("change", updateChoropleth);

function updateChoropleth(dataYears2014, world) {

    // --> Choropleth implementation
    var selectBox1 = document.getElementById("ranking-type");
    var aspect = selectBox1.options[selectBox1.selectedIndex].value;

    //console.log(aspect+"Score");

    quantize.domain(d3.extent(allData, function (d) {
        return +d[aspect + "Score"]
    }));

    //legend

    var legend = d3.select('#legend')
        .append('ul')
        .attr('class', 'list-inline');

    var keys = legend.selectAll('li.key')
        .data(quantize.range());

    //legend.exit()
    //    .attr("opacity", 1)
    //    .transition()
    //    .duration(1000)
    //    .attr("opacity", 0)
    //    .remove();

    keys.enter().append('li')
        .attr('class', 'key')
        .style('border-top-color', String)
        .text(function (d) {
            var r = quantize.invertExtent(d);
            return formatNumber(r[0]);
        });

    // var g = svg.append("g")
    //    .attr("class", "key")
    //    .attr("transform", "translate(" + (width - 240) / 2 + "," + height / 2 + ")");
    //
    //g.selectAll("rect")
    //    .data(threshold.range().map(function(quantize) {
    //        var d = threshold.invertExtent(quantize);
    //        if (d[0] == null) d[0] = quantize.domain()[0];
    //        if (d[1] == null) d[1] = quantize.domain()[1];
    //        return d;
    //    }))
    //    .enter().append("rect")
    //    .attr("height", 8)
    //    .attr("x", function(d) { return quantize(d[0]); })
    //    .attr("width", function(d) { return quantize(d[1]) - quantize(d[0]); })
    //    .style("fill", function(d) { return threshold(d[0]); });
    //
    //g.call(xAxis).append("text")
    //    .attr("class", "caption")
    //    .attr("y", -6)
    //    .text(aspect);


    // Render the world by using the path generator & Bostock https://bl.ocks.org/mbostock/4060606

    //console.log(dataYears2014[4]);

    var worldMap = svg.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function (d) {
            //console.log(d.id);
            if (d.id === null) {
                return "steelblue";
            } else {
                if (d.id === null) {
                    return "#ccc";
                } else {
                    //console.log(quantize(findAspect(d.properties.adm0_a3_is, aspect)));
                    return quantize(findAspect(dataYears2014, d.id, aspect + "Score"));
                }
            }
        });

}

function findAspect(data, ID, aspect) {
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

    chartData.sort( function(a, b){
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
            return (i * (barWidth / chartData.length)) - barPadding;
        })
        .attr("x", barPadding)
        .attr("height", barHeight / chartData.length)
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