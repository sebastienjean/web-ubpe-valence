// Anything related to the map. Uses leaflet.

'use strict';

// Create the map.
var map = L.map('map', settings.map);

// Configure leaflet, specify the tile server.
L.tileLayer("http://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            {
              subdomains : '0123',
              attribution : 'UBPE 2013 - IUT Valence',
              maxZoom : 18,
              minZoom : 0
            }).addTo(map);

for (var i in settings.POI) {
  L.marker([ settings.POI[i][0], settings.POI[i][1] ], {zIndexOffset : 15000})
  .addTo(map)
  .bindPopup("<div style=\"color : black\">" + settings.POI[i][2] + "</div>");
}

// Custom icons.
var SmallIcon = L.Icon.extend({  // Create the "small icon" class.
  options: {
    iconSize : [20, 20],  // size of the icon
    iconAnchor : [10, 10],  // point of the icon which will correspond to marker's location
    popupAnchor : [0, -5]  // point from which the popup should open relative to the iconAnchor
  }
});

var greyIcon = new SmallIcon({iconUrl : settings.map['speedIconsPath'] + "/grey.png"});
var blueIcon = new SmallIcon({iconUrl : settings.map['speedIconsPath'] + "/blue.png"});
var greenIcon = new SmallIcon({iconUrl : settings.map['speedIconsPath'] + "/green.png"});
var orangeIcon = new SmallIcon({iconUrl : settings.map['speedIconsPath'] + "/orange.png"});
var redIcon = new SmallIcon({iconUrl : settings.map['speedIconsPath'] + "/red.png"});

var burstIcon = L.icon({
  iconUrl : settings.map['speedIconsPath'] + "/burst.png",
  iconSize : [60, 60],
  iconAnchor : [30, 30],
  popupAnchor : [0, -5]
});
