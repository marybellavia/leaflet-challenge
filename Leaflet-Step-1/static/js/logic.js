var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Function to determine marker size based on population
  function markerSize(mag) {
  return mag * 20000;
  }
  // console.log(earthquakeData);
  var earthquakeMarkers = [];
  var color;

  // Loop through locations and create city and state markers
  for (var i = 0; i < earthquakeData.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
    
    if(earthquakeData[i].geometry.coordinates[2] <= 10) {
      color = "#69B34C";
    }
    else if (earthquakeData[i].geometry.coordinates[2] <= 30){
      color = "#ACB733";
    }
    else if (earthquakeData[i].geometry.coordinates[2] <= 50){
      color = "#FAB733";
    }
    else if (earthquakeData[i].geometry.coordinates[2] <= 70){
      color = "#FF8E15";
    }
    else if (earthquakeData[i].geometry.coordinates[2] <= 90){
      color = "#FF4E11";
    }
    else if (earthquakeData[i].geometry.coordinates[2] > 90){
      color = "#FF0D0D";
    }
    
    earthquakeMarkers.push(
      L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.90,
        stroke: true,
        color: "black",
        weight: 1,
        fillColor: color,
        radius: markerSize(earthquakeData[i].properties.mag)
      })
    );
  }

  // marker layer???
  // // Define a function we want to run once for each feature in the features array
  // // Give each feature a popup describing the place and time of the earthquake
  // function onEachFeature(feature, layer) {
  //   layer.bindPopup("<h3>" + feature.properties.place +
  //     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  // }
  
  // // Create a GeoJSON layer containing the features array on the earthquakeData object
  // // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  // });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakeMarkers);
}
  
  function createMap(earthquakeMarkers) {
    console.log(earthquakeMarkers);
    // Define lightmap layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    var quakes = L.layerGroup(earthquakeMarkers);
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      // Earthquakes: earthquakes,
      Quakes: quakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [lightmap, quakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }