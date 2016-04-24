'use strict';
var settings = {};

// Field labels (for charts and tables)
settings.fieldLabels = {  // "fieldName" : "label"
  "timestamp" : "Time",
  "stationName" : "Station Name",
  "objectName" : "Object",
  "frameCounter" : "Frame",
  "resetCounter" : "Reset",
  "secondsSinceLastReset" : "System time",
  "RTCTime" : "RTC time",
  "GPSTime" : "GPS time",
  "fixGPS" : "GPS fix",
  "longGPS" : "Longitude",
  "latGPS" : "Latitude",
  "altGPS" : "Altitude",
  "speedGPS" : "Speed",
  "courseGPS" : "Course",
  "numSatsGPS" : "Sats",
  "hdop" : "Precision",
  "boardTemperatureAnalogSensor" : "Temp. board",
  "externalTemperatureAnalogSensor" : "Temp. out",
  "internalTemperatureAnalogSensor" : "Temp. in",  
  "externalHumidityAnalogSensor" : "Hygro",
  "differentialPressureAnalogSensor" : "Pressure",
  "visibleLuminosityAnalogSensor" : "Lum. visible",
  "irLuminosityAnalogSensor" : "Lum. IR",
  "batteryTemperatureAnalogSensor" : "Temp. LiPo",
  "voltageAnalogSensor" : "Voltage"
};

// Measurement units
settings.fieldUnits = {  // "fieldName" : "unit"
  "secondsSinceLastReset" : "s",
  "longGPS" : "&deg;",
  "latGPS" : "&deg;",
  "altGPS" : "m",
  "speedGPS" : "km/h",
  "courseGPS" : "&deg;",
  "boardTemperatureAnalogSensor" : "&deg;C",
  "internalTemperatureAnalogSensor" : "&deg;C",
  "externalTemperatureAnalogSensor" : "&deg;C",
  "externalHumidityAnalogSensor" : "&#37;",
  "differentialPressureAnalogSensor" : "hPa",
  "visibleLuminosityAnalogSensor" : "lux",
  "irLuminosityAnalogSensor" : "mW/cm&sup2;",
  "batteryTemperatureAnalogSensor" : "&deg;C",
  "voltageAnalogSensor" : "V",
};

// Measurement precision
settings.fieldFixedPoints = {  // "fieldName" : "number of digit after floating point"
  "secondsSinceLastReset" : 0,
  "altGPS" : 0,
  "speedGPS" : 0,
  "internalTemperatureAnalogSensor" : 1,
  "boardTemperatureAnalogSensor" : 1,
  "externalTemperatureAnalogSensor" : 1,
  "externalHumidityAnalogSensor" : 0,
  "differentialPressureAnalogSensor" : 0,
  "visibleLuminosityAnalogSensor" : 0,
  "irLuminosityAnalogSensor" : 0,
  "batteryTemperatureAnalogSensor" : 1,
  "voltageAnalogSensor" : 1,
  "headingPseudoAnalogSensor" : 1,
  "frameCounter": 0,
  "resetCounter": 0
};

settings.dataBriefLabels = ["timestamp", "frameCounter", "resetCounter",
  "altGPS", "courseGPS", "internalTemperatureAnalogSensor",
  "boardTemperatureAnalogSensor", "externalTemperatureAnalogSensor",
  "differentialPressureAnalogSensor", "externalHumidityAnalogSensor",
  "voltageAnalogSensor"];

settings.sensorCalibration = {
  // An array containing the name of the data and a, b as calibratedData = (data * a) + b
  "internalTemperatureAnalogSensor" : [ 0.00161, -27.93 ],
  "boardTemperatureAnalogSensor" : [ 0.12534, -80.52 ],
  "externalTemperatureAnalogSensor" : [ 0.00161, -27.93 ],
  "externalHumidityAnalogSensor" : [ 0.001738, 41.29 ],
  "differentialPressureAnalogSensor" : [ 1.08507, 965], // 1010
  "visibleLuminosityAnalogSensor" : [ 1.1867, 38850 ],
  "irLuminosityAnalogSensor" : [ 0.001, 33.29 ],
  "voltageAnalogSensor" : [ 0.0097, 0 ],
  "speedGPS" : [ 1.852, 0 ],
  "frameCounter": [ 1, 0 ],
  "resetCounter": [ 1, 0 ],
  "batteryTemperatureAnalogSensor": [ -0.09091, 70.91]
};

settings.chartXAxis = ["timestamp", "frameCounter", "altGPS"];

settings.chartYAxis = [
  "altGPS", "internalTemperatureAnalogSensor", "boardTemperatureAnalogSensor",
    "externalTemperatureAnalogSensor", "externalHumidityAnalogSensor",
    "differentialPressureAnalogSensor", "visibleLuminosityAnalogSensor",
    "irLuminosityAnalogSensor", 
    "voltageAnalogSensor", "speedGPS", "courseGPS", "numSatsGPS",
    "resetCounter", "batteryTemperatureAnalogSensor"];

// Tiles server list
settings.mapServers = {
  "online" : "http://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  "offline" : "./ressources/tiles/{z}/{x}/{y}.png"
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
  "iut-radio" : [ 44.91568, 4.91524, "IUT de Valence, FM station" ]
};

settings.gpsFields = [
  'GPSTime', 'fixGPS', 'longGPS', 'latGPS', 'altGPS',
  'speedGPS', 'courseGPS', 'numSatsGPS', 'hdop'];
