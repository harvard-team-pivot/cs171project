/**
 * Created by keerys on 4/16/16.
 */
//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////

var data = [
    [//Singapore
        {axis:"CustomsScore",value:3.90},
        {axis:"Domestic Logistics Score",value:2.70},
        {axis:"Ease of ShipmentScore",value:4.04},
        {axis:"Ease of TrackingScore ",value:4.25},
        {axis:"InfrastructureScore",value:4.27},
        {axis:"Logistics ServicesScore",value:4.21},
        {axis:"TimelinessScore",value:4.53},
        {axis:"Overall LPI Score",value:4.19}
    ],[//Netherlands
        {axis:"CustomsScore",value:4.90},
        {axis:"Domestic Logistics Score",value:2.60},
        {axis:"Ease of ShipmentScore",value:4.45},
        {axis:"Ease of TrackingScore ",value:3.25},
        {axis:"InfrastructureScore",value:2.12},
        {axis:"Logistics ServicesScore",value:3.21},
        {axis:"TimelinessScore",value:4.53},
        {axis:"Overall LPI Score",value:3.19}
    ],[//Singapore
        {axis:"CustomsScore",value:2.90},
        {axis:"Domestic Logistics Score",value:1.70},
        {axis:"Ease of ShipmentScore",value:3.04},
        {axis:"Ease of TrackingScore ",value:2.25},
        {axis:"InfrastructureScore",value:1.27},
        {axis:"Logistics ServicesScore",value:3.21},
        {axis:"TimelinessScore",value:3.53},
        {axis:"Overall LPI Score",value:3.19}
    ]
];
//////////////////////////////////////////////////////////////
//////////////////// Draw the Chart //////////////////////////
//////////////////////////////////////////////////////////////

var color = d3.scale.ordinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);

var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 5,
    levels: 5,
    roundStrokes: true,
    color: color
};
//Call function to draw the Radar chart
RadarChart(".radarChart", data, radarChartOptions);