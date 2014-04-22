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
  "irLuminosityAnalogSensor" : "mW/cm&sup2;",
  "uvLuminosityAnalogSensor" : "mW/cm&sup2;",
  "batteryTemperatureAnalogSensor" : "&deg;C",
  "voltageAnalogSensor" : "V",
  "headingPseudoAnalogSensor" : "&deg;",
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
  "voltageAnalogSensor" : 1,
  "headingPseudoAnalogSensor" : 1,
  "xAccelerationAnalogSensor" : 1,
  "yAccelerationAnalogSensor" : 1,
  "zAccelerationAnalogSensor" : 1,
  "frameCounter": 0,
  "resetCounter": 0
};

settings.dataBriefLabels = ["timestamp", "frameCounter", "resetCounter",
  "altGPS", "capGPS", "internalTemperatureAnalogSensor",
  "middleTemperatureAnalogSensor", "externalTemperatureAnalogSensor",
  "differentialPressureAnalogSensor", "externalHumidityAnalogSensor",
  "voltageAnalogSensor"];

settings.sensorCalibration = {
  // An array containing the name of the data and a, b as calibratedData = (data * a) + b
  "middleTemperatureAnalogSensor" : [ 0.0043226031338526915, -92.49291784702551 ],
  "internalTemperatureAnalogSensor" : [ 0.13832330028328613, -54.24929178470256 ],
  "externalTemperatureAnalogSensor" : [ 0.0043226031338526915, -92.49291784702551 ],
  "externalHumidityAnalogSensor" : [ 0.004578125, -21 ],
  "differentialPressureAnalogSensor" : [ -1.2207, 1284 ],
  "visibleLuminosityAnalogSensor" : [ 2.25067138671875, -112 ],
  "irLuminosityAnalogSensor" : [ 0.002384185791015625, 0 ],
  "uvLuminosityAnalogSensor" : [ 0.34637451171875, -5680 ],
  "voltageAnalogSensor" : [ 0.0097, 0 ],
  "speedGPS" : [ 1.852, 0 ],
  "headingPseudoAnalogSensor" : [ 0.1, 0 ],
  "xAccelerationAnalogSensor" : [ 0.016276041666666668, -5.0],
  "yAccelerationAnalogSensor" : [ 0.016276041666666668, -5.0],
  "zAccelerationAnalogSensor" : [ 0.016276041666666668, -5.0],
  "frameCounter": [ 1, -1641 ],
  "resetCounter": [ 1, -74 ]
};

settings.chartXAxis = ["timestamp", "frameCounter", "altGPS"];

settings.chartYAxis = [
  "altGPS", "internalTemperatureAnalogSensor", "middleTemperatureAnalogSensor",
    "externalTemperatureAnalogSensor", "externalHumidityAnalogSensor",
    "differentialPressureAnalogSensor", "visibleLuminosityAnalogSensor",
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
  "iut-radio" : [ 44.91568, 4.91524, "IUT de Valence, FM station" ]
};
