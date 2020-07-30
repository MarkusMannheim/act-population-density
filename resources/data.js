const d3 = require("d3"),
      fs = require("fs");

fs.readFile("actPop.geojson", "utf8", function(error, data) {
  if (error) throw error;
  newData = JSON.parse(data)
    .features;
  newData = newData
    .filter(function(d) {
      return d.properties.density >= 10;
    });
  extent = d3.extent(newData, function(d) { return d.properties.density; });
  colours = d3.scaleSequentialLog(d3.interpolateSpectral)
    .domain(extent.reverse());
  height = d3.scaleLinear()
    .domain(extent.reverse())
    .range([0, 15000]);
  console.log(extent);
  newData = newData.map(function(d) {
    d.properties.colour = colours(d.properties.density);
    d.properties.density = height(d.properties.density);
    return d;
  });
  newData = {
    type: "FeatureCollection",
    features: newData
  };
  fs.writeFile("./resources/population.geojson", JSON.stringify(newData), function(error) {
    console.log("population.geojson written");
  });
});
