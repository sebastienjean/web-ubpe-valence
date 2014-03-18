'use strict';
var settings = {};

// Field labels (for charts and tables)
settings.fieldLabels = {  // "fieldName" : "label"
  "date" : "Time",
  "stationName" : "Station",
  "objectName" : "Object",
  "frameCounter" : "Frame",
  "resetCounter" : "Reset",
  "currentFlightPhaseNumber" : "Phase",
  "currentFlightPhaseDurationInSeconds" : "Phase duration",
  "secondsSinceLastReset" : "System time",
  "RTCTime" : "RTC time",
  "GPSTime" : "GPS time",
  "fixGPS" : "GPS fix",
  "longGPS" : "Longitude",
  "latGPS" : "Latitude",
  "altGPS" : "Altitude",
  "speedGPS" : "Speed",
  "capGPS" : "Course",
  "numSatsGPS" : "Sats",
  "hdop" : "Precision",
  "internalTemperatureAnalogSensor" : "Temp. in",
  "middleTemperatureAnalogSensor" : "Temp. middle",
  "externalTemperatureAnalogSensor" : "Temp. out",
  "externalHumidityAnalogSensor" : "Hygro",
  "differentialPressureAnalogSensor" : "Pressure",
  "upLuminosityAnalogSensor" : "Lux up",
  "side1LuminosityAnalogSensor" : "Lux side1",
  "side2LuminosityAnalogSensor" : "Lux side2",
  "soundLevelAnalogSensor" : "Sound level",
  "batteryTemperatureAnalogSensor" : "Temp. Bat",
  "voltageAnalogSensor" : "Voltage"
};

// Measurement units
settings.fieldUnits = {  // "fieldName" : "unit"
  "currentFlightPhaseDurationInSeconds" : "s",
  "secondsSinceLastReset" : "s",
  "longGPS" : "°",
  "latGPS" : "°",
  "altGPS" : "m",
  "speedGPS" : "km/h",
  "capGPS" : "°",
  "internalTemperatureAnalogSensor" : "°C",
  "middleTemperatureAnalogSensor" : "°C",
  "externalTemperatureAnalogSensor" : "°C",
  "externalHumidityAnalogSensor" : "%",
  "differentialPressureAnalogSensor" : "hPa",
  "upLuminosityAnalogSensor" : "lux",
  "side1LuminosityAnalogSensor" : "lux",
  "side2LuminosityAnalogSensor" : "lux",
  "batteryTemperatureAnalogSensor" : "°C",
  "voltageAnalogSensor" : "V"
};

// Measurement precision
settings.fieldFixedPoints = {  // "fieldName" : "number of digit after floating point"
  "currentFlightPhaseDurationInSeconds" : 0,
  "secondsSinceLastReset" : 0,
  "altGPS" : 0,
  "speedGPS" : 0,
  "internalTemperatureAnalogSensor" : 1,
  "middleTemperatureAnalogSensor" : 1,
  "externalTemperatureAnalogSensor" : 1,
  "externalHumidityAnalogSensor" : 0,
  "differentialPressureAnalogSensor" : 0,
  "upLuminosityAnalogSensor" : 0,
  "side1LuminosityAnalogSensor" : 0,
  "side2LuminosityAnalogSensor" : 0,
  "batteryTemperatureAnalogSensor" : 1,
  "voltageAnalogSensor" : 1
};

settings.dataBriefLabels = [
  "date","currentFlightPhaseNumber", "altGPS", "capGPS",
  "internalTemperatureAnalogSensor", "middleTemperatureAnalogSensor",
  "externalTemperatureAnalogSensor","externalHumidityAnalogSensor",
  "differentialPressureAnalogSensor", "voltageAnalogSensor" ];

settings.sensorCalibration = {
  // An array containing the name of the data and a, b as calibratedData = (data * a) + b
  "middleTemperatureAnalogSensor" : [ 0.15625, -79.5 ],
  "internalTemperatureAnalogSensor" : [ 0.1701, -56.66 ],
  "externalTemperatureAnalogSensor" : [ 0.15625, -79.5 ],
  "externalHumidityAnalogSensor" : [ 0.1465, -21 ],
  "differentialPressureAnalogSensor" : [ -1.2207, 1284 ],
  "upLuminosityAnalogSensor" : [8.4179, 0 ],
  "side1LuminosityAnalogSensor" : [ 0.8418, 0 ],
  "side2LuminosityAnalogSensor" : [ 0.8418, 0 ],
  "soundLevelAnalogSensor" : [ 0, 0 ],
  "batteryTemperatureAnalogSensor" : [ -0.0542, 50.31 ],
  "voltageAnalogSensor" : [ 0.0097, 0 ],
  "speedGPS" : [ 1.852, 0 ]
};

settings.chartXAxis = [ "date", "altGPS"];

settings.chartYAxis = [
  "altGPS", "internalTemperatureAnalogSensor", "middleTemperatureAnalogSensor",
  "externalTemperatureAnalogSensor", "batteryTemperatureAnalogSensor",
  "externalHumidityAnalogSensor", "differentialPressureAnalogSensor", "upLuminosityAnalogSensor",
  "side1LuminosityAnalogSensor", "side2LuminosityAnalogSensor", "soundLevelAnalogSensor",
  "voltageAnalogSensor", "fixGPS", "speedGPS", "capGPS", "numSatsGPS",
  "resetCounter", "currentFlightPhaseNumber"];

// Tiles server list
settings.tabServers = {  // "layerName" : ["tileServerURL", "subdomains", "layerLabel"]
  "osmMap" : [ "http://{s}.tile.osm.org/{z}/{x}/{y}.png", "", "OSM Map" ],
  "googleMap" : [ "http://mt{s}.google.com/vt/v=w2.106&x={x}&y={y}&z={z}&s=", "0123", "Google Map" ],
  "googleHybrid" : [ "http://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", "0123", "Google Hybrid" ],
  "mapQuest" : [ "http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", "1234", "Map Quest" ]
};

settings.map = {
  "center" : [ 44.91568, 4.91524 ],
  "zoom" : 0,
  "maxZoom" : 18,
  "minZoom" : 0,
  "courseIconsPath" : './ressources/img/map-course',
  "speedIconsPath" : './ressources/img/map-speed'
};

// POI list
settings.POI = {  // "pointName" : [Lat, Lng, "popupText"]
  "iut-radio" : [ 44.91568, 4.91524, "IUT de Valence, FM station" ],
  "landing point" :[44.6289605, 5.0225093, "Landing point"]
};
