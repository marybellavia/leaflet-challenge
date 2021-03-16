// api queryurl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(queryUrl, function (data) {
  // send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // creating a function to get the style for markers
  function getStyle(earthquakeData, layer) {

    // function to dynamically change the size of the marker
    function markerSize(mag) { return mag * 4; }

    //conditional to get the correct color for marker
    var color;
    if (earthquakeData.geometry.coordinates[2] <= 10) {
      color = "#69B34C";
    }
    else if (earthquakeData.geometry.coordinates[2] <= 30) {
      color = "#ACB733";
    }
    else if (earthquakeData.geometry.coordinates[2] <= 50) {
      color = "#FAB733";
    }
    else if (earthquakeData.geometry.coordinates[2] <= 70) {
      color = "#FF8E15";
    }
    else if (earthquakeData.geometry.coordinates[2] <= 90) {
      color = "#FF4E11";
    }
    else if (earthquakeData.geometry.coordinates[2] > 90) {
      color = "#FF0D0D";
    }

    // returning a dictionary
    return {
      stroke: false,
      fillOpacity: 0.90,
      stroke: true,
      color: "black",
      weight: 1,
      fillColor: color,
      radius: markerSize(earthquakeData.properties.mag)
    };
  }
  // defining a function that will bind a popup describing the place and time of the earthquake for each marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // creating a GeoJSON layer containing the features array on the earthquakeData object
  // running the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    style: getStyle,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    }
  });

  // sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakeMarkers) {
  // defining lightmap layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // defining a baseMaps object to hold our lightmap base layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakeMarkers
  };

  // creating map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakeMarkers]
  });

  // creating a layer control, pass in our baseMaps and overlayMaps & adding the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // adding the legend
  var legend = L.control({ position: 'bottomright' });

  // legend details
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    const magnitudes = [-10, 10, 30, 50, 70, 90];
    const colors = ["#69B34C", "#ACB733", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
    
    // title for legend
    div.innerHTML += '<p>Earthquake Magnitude</p>';
    
    // looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {
      console.log(colors[i]);
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // adding legend to the map.
  legend.addTo(myMap);
};