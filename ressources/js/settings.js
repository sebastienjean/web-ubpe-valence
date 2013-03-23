
var settings = {};

//Unités des mesures
settings.tabUnites = { 	
				"altitude" : "m",
				"speedGPS" : "nd",
				"luxAverage" : "lux",
				"tempIn" : "&degC",
				"tempOut" : "&degC",
				"pressure" : "hPa"
			};
			
//Tiles servers -> layerName : [ tileServerURL, subdomains, layerLabel]		
settings.tabServers = {
						"osmMap" : ["http://{s}.tile.osm.org/{z}/{x}/{y}.png", "", "OSM Map"],
						"googleMap" : ["http://mt{s}.google.com/vt/v=w2.106&x={x}&y={y}&z={z}&s=", "0123", "Google Map"],
						"googleHybrid" : ["http://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", "0123", "Google Hybrid"],
						"mapQuest" : ["http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", "1234", "Map Quest"]
						};