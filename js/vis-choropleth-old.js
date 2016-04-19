// --> CREATE SVG DRAWING AREA
var width = 500,
    height = 400;
formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".0f");

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

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

var raw2007, raw2010, raw2012, raw2014 = {};
var allData = [];

var aspect = "At_risk";

var quantize = d3.scale.quantize()
    //.domain([0, 100])
    .range(colorbrewer.Greens[9]);
//.map(function(i) { return "q" + i + "-9"; }));

//console.log(colorbrewer.Greens[9]);

var malariaDataByCountryId = [];

// Use the Queue.js library to read two files

queue()
    .defer(d3.csv, "data/International_LPI_from_2007.csv")
    .defer(d3.csv, "data/International_LPI_from_2010.csv")
    .defer(d3.csv, "data/International_LPI_from_2012.csv")
    .defer(d3.csv, "data/International_LPI_from_2014.csv")
    .await(function (error, raw2007csv, raw2010csv, raw2012csv, raw2014csv) {

        //console.log(raw2007csv);
        //console.log(raw2012csv);
        //console.log(raw2012csv);
        //console.log(raw2014csv);

        // --> PROCESS DATA

        var dataYears = [raw2007csv,raw2010csv,raw2012csv,raw2014csv];
        var years = [2007,2010,2012,2014];
        //console.log(dataYears.length);

        for (var i = 0; dataYears.length; i++) {
            console.log(dataYears[i]);
            dataYears[i].forEach(function (d) {
                d.year = years[i]; // returns a Date
            });
            allData = allData.concat(dataYears[i]);
        }

         console.log(allData);

        // TODO filtered data was removing mediterranean countries
        //malariaData = malariaDataCsv.filter(function (d) {
        //    return (d.WHO_region === "African");
        //});

        //console.log(malariaData);

        // Convert TopoJSON to GeoJSON (target object = 'states')
        africa = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;

        //console.log(africa);

        for (var i = 0; i < malariaData.length; i++)
            malariaDataByCountryId[malariaData[i].Code] = malariaData[i];

        //console.log(malariaDataByCountryId);

        //console.log(findAspect("AGO","UN_population"));
        //console.log(findAspect("NAM","At_risk"));

        // Update choropleth
        updateChoropleth();
    });

//d3.select("#ranking-type").on("change", updateChoropleth);

function updateChoropleth() {

    // --> Choropleth implementation
    var selectBox1 = document.getElementById("ranking-type");
    var aspect = selectBox1.options[selectBox1.selectedIndex].value;

    console.log(aspect);

    quantize.domain(d3.extent(malariaData, function (d) {
        return +d[aspect]
    }));

    console.log(quantize(20));

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
            return formatPercent(r[0]);
        });

    //var g = svg.append("g")
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

    var worldMap = svg.selectAll("path")
        .data(africa)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function (d) {
            if ((d.properties.adm0_a3_is) === null) {
                return "steelblue";
            } else {
                if (findAspect(d.properties.adm0_a3_is, aspect) === null) {
                    return "#ccc";
                } else {
                    //console.log(quantize(findAspect(d.properties.adm0_a3_is, aspect)));
                    return quantize(findAspect(d.properties.adm0_a3_is, aspect));
                }
            }
        });

}

function findAspect(country, aspect) {
    //for (africa[country].properties.adm0_a3_is == country)
    if (typeof malariaDataByCountryId[country] === "undefined") {
        //console.log('the property is not available...'); // print into console
        return null;
    } else {
        return malariaDataByCountryId[country][aspect];
    }
}