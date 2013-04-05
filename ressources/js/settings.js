
var settings = {};

//Measurment units
settings.tabUnites = { //"unitName" : "unit" 	
				"sensor1" : "unit",
				"sensor2" : "unit",
				"sensor3" : "unit",
				"sensor4" : "unit",
				"speedGPS" : "km/h",
				"altGPS" : "m",
				"hdop" : "unit",
				"date" : "",
				"voltage" : "V"
			};
			
//Tiles server list
settings.tabServers = { //"layerName" : ["tileServerURL", "subdomains", "layerLabel"]	
						"osmMap" : ["http://{s}.tile.osm.org/{z}/{x}/{y}.png", "", "OSM Map"],
						"googleMap" : ["http://mt{s}.google.com/vt/v=w2.106&x={x}&y={y}&z={z}&s=", "0123", "Google Map"],
						"googleHybrid" : ["http://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", "0123", "Google Hybrid"],
						"mapQuest" : ["http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", "1234", "Map Quest"]
						};
//POI list			
settings.POI = { //"pointName" : [Lat, Lng, "popupText"]
				"iut" : [44.91568, 4.91524, "IUT de Valence"],
				"pointArbitraire" : [44.91970, 4.9200, "Point arbitraire <br/> (Ne sert &agrave rien)"],
				};