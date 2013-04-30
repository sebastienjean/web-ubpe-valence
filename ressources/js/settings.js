var settings = {};

// Measurment units
settings.fieldUnits =
{ // "fieldName" : "unit"
    "currentFlightPhaseDurationInSeconds" : "s",
    "secondsSinceLastReset" : "s",
    "differentialPressureAnalogSensor" : "hPa",
    "absolutePressureAnalogSensor" : "hPa",
    "externalTemperatureAnalogSensor" : "°C",
    "internalTemperatureAnalogSensor" : "°C",
    "speedGPS" : "km/h",
    "altGPS" : "m",
    "voltageAnalogSensor" : "V"
};

// Measurment precision
settings.fieldFixedPoints =
{ // "fieldName" : "number of digit after floating point"
    "currentFlightPhaseDurationInSeconds" : 0,
    "secondsSinceLastReset" : 0,
    "differentialPressureAnalogSensor" : 0,
    "absolutePressureAnalogSensor" : 0,
    "externalTemperatureAnalogSensor" : 1,
    "internalTemperatureAnalogSensor" : 1,
    "speedGPS" : 0,
    "altGPS" : 0,
    "voltageAnalogSensor" : 1
};

// Field labels (for charts and tables)

settings.fieldLabels =
{ // "fieldName" : "label"
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
    "differentialPressureAnalogSensor" : "Pressure diff.",
    "absolutePressureAnalogSensor" : "Pressure abs.",
    "externalTemperatureAnalogSensor" : "Temperature out",
    "internalTemperatureAnalogSensor" : "Temperature in",
    "voltageAnalogSensor" : "Voltage"
};

// Tiles server list
settings.tabServers =
{ // "layerName" : ["tileServerURL", "subdomains", "layerLabel"]
    "osmMap" : [ "http://{s}.tile.osm.org/{z}/{x}/{y}.png", "", "OSM Map" ],
    "googleMap" : [ "http://mt{s}.google.com/vt/v=w2.106&x={x}&y={y}&z={z}&s=", "0123", "Google Map" ],
    "googleHybrid" : [ "http://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", "0123", "Google Hybrid" ],
    "mapQuest" : [ "http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", "1234", "Map Quest" ]
};

settings.map = 
{
	"center" : [ 44.91568, 4.91524],
	"zoom"   : 15
};

// POI list
settings.POI =
{ // "pointName" : [Lat, Lng, "popupText"]
    "iut" : [ 44.91568, 4.91524, "IUT de Valence" ],
    "pointArbitraire" : [ 44.91970, 4.9200, "Point arbitraire <br/> (Ne sert &agrave rien)" ],
};