'use strict';
var settings = {};

// Field labels (for charts and tables)
settings.fieldLabels = {  // "fieldName" : "label"
  "timestamp" : "Timestamp",
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
  "capGPS" : "Course",
  "numSatsGPS" : "Sats",
  "hdop" : "Precision",
  "internalTemperatureAnalogSensor" : "Temp. in",
  "externalTemperatureAnalogSensor" : "Temp. out",
  "middleTemperatureAnalogSensor" : "Temp. middle",  
  "externalHumidityAnalogSensor" : "Hygro",
  "differentialPressureAnalogSensor" : "Pressure",
  "xAccelerationAnalogSensor" : "Acc. X",
  "yAccelerationAnalogSensor" : "Acc. Y",
  "zAccelerationAnalogSensor" : "Acc. Z",
  "visibleLuminosityAnalogSensor" : "Lux visible",
  "irLuminosityAnalogSensor" : "Lux ir",
  "uvLuminosityAnalogSensor" : "Lux uv",
  "batteryTemperatureAnalogSensor" : "Temp. Bat",
  "headingPseudoAnalogSensor" : "Heading",
  "voltageAnalogSensor" : "Voltage"
};

// Measurement units
settings.fieldUnits = {  // "fieldName" : "unit"
  "secondsSinceLastReset" : "s",
  "longGPS" : "&deg;",
  "latGPS" : "&deg;",
  "altGPS" : "m",
  "speedGPS" : "km/h",
  "capGPS" : "&deg;",
  "internalTemperatureAnalogSensor" : "&deg;C",
  "middleTemperatureAnalogSensor" : "&deg;C",
  "externalTemperatureAnalogSensor" : "&deg;C",
  "externalHumidityAnalogSensor" : "&#37;",
  "differentialPressureAnalogSensor" : "hPa",
  "visibleLuminosityAnalogSensor" : "lux",
  "irLuminosityAnalogSensor" : "lux",
  "uvLuminosityAnalogSensor" : "lux",
  "batteryTemperatureAnalogSensor" : "&deg;C",
  "voltageAnalogSensor" : "V"
};

// Measurement precision
settings.fieldFixedPoints = {  // "fieldName" : "number of digit after floating point"
  "secondsSinceLastReset" : 0,
  "altGPS" : 0,
  "speedGPS" : 0,
  "internalTemperatureAnalogSensor" : 1,
  "middleTemperatureAnalogSensor" : 1,
  "externalTemperatureAnalogSensor" : 1,
  "externalHumidityAnalogSensor" : 0,
  "differentialPressureAnalogSensor" : 0,
  "visibleLuminosityAnalogSensor" : 0,
  "irLuminosityAnalogSensor" : 0,
  "uvLuminosityAnalogSensor" : 0,
  "batteryTemperatureAnalogSensor" : 1,
  "voltageAnalogSensor" : 1
};

settings.dataBriefLabels = ["altGPS", "capGPS",
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
  "visibleLuminosityAnalogSensor" : [8.4179, 0 ],
  "irLuminosityAnalogSensor" : [ 0.8418, 0 ],
  "uvLuminosityAnalogSensor" : [ 0.8418, 0 ],
  "batteryTemperatureAnalogSensor" : [ -0.0542, 50.31 ],
  "voltageAnalogSensor" : [ 0.0097, 0 ],
  "speedGPS" : [ 1.852, 0 ]
};

settings.chartXAxis = [ "frameCounter", "altGPS"];

settings.chartYAxis = [
  "altGPS", "internalTemperatureAnalogSensor", "middleTemperatureAnalogSensor",
    "externalTemperatureAnalogSensor", "batteryTemperatureAnalogSensor",
    "externalHumidityAnalogSensor", "differentialPressureAnalogSensor", "visibleLuminosityAnalogSensor",
    "irLuminosityAnalogSensor", "uvLuminosityAnalogSensor",
    "voltageAnalogSensor", "speedGPS", "capGPS", "numSatsGPS",
    "resetCounter"];

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
  "iut-radio" : [ 44.91568, 4.91524, "IUT de Valence, FM station" ],
  "landing point" :[44.6289605, 5.0225093, "Landing point"]
};
