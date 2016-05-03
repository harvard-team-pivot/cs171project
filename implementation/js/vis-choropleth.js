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
    .translate([width / 2, ((height / 2) + 50)])
    .precision(.1);

// var projection = d3.geo.eckert5()
//     .scale((width + 1) / 2 / Math.PI)
//     .translate([width / 2, ((height / 2)+50)])
//     .precision(.1);    

var path = d3.geo.path()
    .projection(projection);

var x = d3.scale.linear()
    .domain([0, 5])
    .range([0, barWidth]);

var raw2007, raw2010, raw2012, raw2014 = {};
var selectedYear = 2007;
var allData =[];
var yearData = [];
var myAxes = {};
var myAllData = [];
var myAllArray = {};
var radarData;
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

var folded;

// slider
var slider = d3.slider().min(2007).max(2014).tickValues([2007, 2010, 2012, 2014]).stepValues([2007, 2010, 2012, 2014]).showRange(true).value(4);
d3.select('#slider').call(slider);

// Initialize tooltip
// Variablize
var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
    return "The " + d.Country + " customs score is " + d.CustomsScore + ".";
});

var tooltip = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

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

        // year dropdown

        var yearDropdownData = d3.nest()
            .sortValues(function (a, b) {
                return d3.descending(b["Year"], a["Year"]);
            })
            .entries(allData);

        var yearDropDown = d3.select("#year_container").append("select")
            .attr("name", "year-list");

        var yearOptions = yearDropDown.selectAll("option")
            //.data(yearDropdownData)
            .data(years)
            .enter()
            .append("option");

        yearOptions.text(function (d) {
                //return d.Year;
                return d;
            })
            .attr("value", function (d) {
                //return d.Year;
                return d;
            });

        yearDropDown.on("change", yearChanged);

        // Update
        updateChoropleth(allData, selectedYear, world);
        $("#ranking-type").change(function () {
            updateChoropleth(allData, selectedYear, world);
        });

        //nonsense I'm working on SK
        yearData = allData.filter(function (i) {
            //alert ($(this).text());
            //return (i.Code == "BHR");
            return (i.Year == selectedYear);
        });

        updateBarChart(yearData, selectedYear);

        //myAxes=Object.keys(allData[0]);
        //variable this so you can use score or rank
        myAxes = Object.keys(allData[0]).filter(function (v) {
            return v.match(/Score/g);
        });

        //radarData.sort(function(a,b) {return a.Country-b.Country;});

        //console.log(radarData);

// innovative folded chart
        folded = new OriDomi('#chart-area', {
            //vPanels: [10, 10, 10, 70] ,
            vPanels: 6,     // number of panels when folding left or right (vertically oriented)
            hPanels: 3,     // number of panels when folding top or bottom
            speed: 1200,  // folding duration in ms
            ripple: 2,     // backwards ripple effect when animating
            shadingIntesity: .5,    // lessen the shading effect
            perspective: 200,   // smaller values exaggerate 3D distortion
            maxAngle: 40,    // keep the user's folds within a range of -40 to 40 degrees
            shading: 'soft' // change the shading type
        });

        folded.accordion(50);

        // country drop-down ->  stackoverflow.com/questions/20780835/putting-the-country-on-drop-down-list-using-d3-via-csv-file

        var dropdownData = d3.nest()
            .sortValues(function (a, b) {
                return d3.descending(b["Country"], a["Country"]);
            })
            .entries(yearData);

        var dropDown = d3.select("#table_container").append("select")
            .attr("name", "country-list");

        var options = dropDown.selectAll("option")
            .data(dropdownData)
            .enter()
            .append("option");

        options.text(function (d) {
                return d.Country;
            })
            .attr("value", function (d) {
                return d.Code;
            });

        dropDown.on("change", menuChanged);

    });

function updateChoropleth(dataset, year, world) {

    var mapData = dataset.filter(function (i) {
        return (i.Year == year);
    });

    var mapDataByID = [];
    for (var i = 0; i < mapData.length; i++) {
        mapDataByID[mapData[i].ID] = mapData[i];
    }

    //console.log(mapDataByID);

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
        })
        .on('mouseover', function (d) {
            var mouse = d3.mouse(svg.node()).map(function (d) {
                return parseInt(d);
            });
            tooltip.classed('hidden', false)
                .attr('style', 'left:' + (mouse[0]) + 'px; top:' + (mouse[1]) + 'px')
                .html("<b>" + mapDataByID[d.id].Country + "</b>" + "</br>" +
                    "Overall LPI Score: " + mapDataByID[d.id]['Overall LPI Score'] + "</br>" +
                    "Customs Score: " + mapDataByID[d.id]['CustomsScore'] + "</br>" +
                    "Infrastructure Score: " + mapDataByID[d.id]['InfrastructureScore'] + "</br>" +
                    "International Shipment Score: " + mapDataByID[d.id]['International ShipmentScore'] + "</br>" +
                    "International Shipment Score: " + mapDataByID[d.id]['International ShipmentScore'] + "</br>" +
                    "Logistics Services Score: " + mapDataByID[d.id]['Logistics ServicesScore'] + "</br>" +
                    "Ease of Tracking Score " + mapDataByID[d.id]['Ease of TrackingScore'] + "</br>" +
                    "Timeliness Score: " + mapDataByID[d.id]['TimelinessScore']
                );
        })
        .on('mouseout', function () {
            tooltip.classed('hidden', true);
        });

    worldMap.exit().remove();

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

    var myBar = svgBar.selectAll("rect")
        .data(chartData);
    myBar.exit()
        .transition()
        .duration(300)
        .remove();

    myBar.enter()
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
        .attr("class", function (d) {
            return d.Code + "Bar";
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
    svgBar.call(tip);

    myBar.transition().duration(300);



}

function findAspect(data, ID, aspect) {
    //console.log(aspect);
    if (typeof data[ID] === "undefined") {
        //console.log('the property is not available...'); // print into console
        return null;
    } else {
        return data[ID][aspect];
    }
}

function menuChanged() {
    //the name isn't important, but has to match the name
    //you added to the menu's "change" event listener.

    var selectedValue = "rect." + d3.event.target.value + "Bar";
    //get the name of the selected option from the change event object

    //console.log(selectedValue);

    //reset bars then change color of selected
    d3.selectAll("rect").style("fill", "grey");
    d3.selectAll(selectedValue).style("fill", "purple");

    //radar chart filtering
    //console.log(d3.event.target.value)

    radarData = yearData.filter(function (d) {
        return d.Code == d3.event.target.value;
    });

    //console.log(radarData);

    for (var i in radarData) {
        for (var key in radarData[i]) {
            if (radarData[i].hasOwnProperty(key)) {

                myAllArray = $.map(radarData[i], function (value, index) {
                    if ($.inArray(index, myAxes) >= 0) {
                        return {value};
                    }
                });
            }
        }
        myAllData.push(myAllArray);
    }


//Call function to draw the Radar chart
    RadarChart(".radarChart", myAllData, radarChartOptions);

}

function yearChanged() {
    //the name isn't important, but has to match the name
    //you added to the menu's "change" event listener.

    selectedYear = d3.event.target.value;
    //console.log(selectedYear);

    yearData = allData.filter(function (i) {
        return (i.Year == selectedYear);
    });

    //updateChoropleth(allData, selectedYear, world);
    updateBarChart(yearData,selectedYear);

}

function mapChanged() {
    //the name isn't important, but has to match the name
    //you added to the menu's "change" event listener.

    var selectedValue = d3.event.target.value;
    //get the name of the selected option from the change event object


    jsonOutside.features.forEach(function (d) {
        // loop through json data to match td entry

        if (selectedValue === d.properties.name) {
            //for each data object in the features array (d), compare it's
            //name against the one you got from the event object
            //if they match, then:

            alert(selectedValue); //remove this line when things are working!

            click(d); // pass json element that matches selected value to click
            //which will respond the same way as if you clicked the country on
            //the map.
        }
    })
}

function animateMap() {

    var timer;  // create timer object
    d3.select('#play')
        .on('click', function() {  // when user clicks the play button
            if(playing == false) {  // if the map is currently playing
                timer = setInterval(function(){   // set a JS interval
                    if(currentAttribute < attributeArray.length-1) {
                        currentAttribute +=1;  // increment the current attribute counter
                    } else {
                        currentAttribute = 0;  // or reset it to zero
                    }
                    sequenceMap();  // update the representation of the map
                    d3.select('#clock').html(attributeArray[currentAttribute]);  // update the clock
                }, 2000);

                d3.select(this).html('stop');  // change the button label to stop
                playing = true;   // change the status of the animation
            } else {    // else if is currently playing
                clearInterval(timer);   // stop the animation by clearing the interval
                d3.select(this).html('play');   // change the button label to play
                playing = false;   // change the status again
            }
        });
}