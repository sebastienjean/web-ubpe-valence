//  commons.js
//  Main functions to handle the data processing
//--------------------------------------------------------------------------------
//  Varaiables :
//  Allow the user to quickly tune the website configuration
//--------------------------------------------------------------------------------
'use strict';

var rawData = [];  // List of raw events.
var filteredData = [];  // List of events, filtered and processed.
var latestTimestamp = 0;  // Store EPOCH in the latest timestamp.
var highestAltitude = 0;  // Highest altitude attained.
var bursted = false;  // Has the balloon poped yet?

// --------------------------------------------------------------------------------
// End of Variables
// --------------------------------------------------------------------------------


/**
 * Get the (possibly updated) data, store it in rawData, and store the
 * filtered data in data.
 */
function updateData(data, callback, raw) {
  console.log('Updating data: ' + data.length + ' events');
  if (!$.isArray(data)) {
    console.error("The data received isn't an array: " + data);
    return;
  }

  var frame;
  var filtered;
  for (var i=data.length - 1; i >= 0; i--) {
    var row = data[i];
    if ($.isArray(row) && row.length == settings.dataFrameLength) {
      frame = createFrameObj(row);
      filtered = filterData(frame);
      rawData.push(frame);
      filteredData.push(filtered);
      if (raw) {
        callback(frame);
      } else {
        callback(filtered);
      }
    } else {
      console.warn('Encountered an invalid line: ' + row);
    }
  };
  if (data.length) {  // There's at least one event.
    updateSummary(filteredData[0]);
    latestTimestamp = data[0][0];
    console.log("Updated latest timestamp: " + dateFormat(new Date(parseInt(latestTimestamp)), "HH:MM:ss"));
  }
}

/**
 * createFrameObj : extract the data from the JSON and add labels to it
 */
function createFrameObj(row) {
  // Initialize a frame object from raw json data.

  // Exemple row:
  // ["1367221880630", "IUT-Radio", "STRATERRESTRE",  "148", "0", "0", "801",
  //  "84", "271658", "001128", "V", "454.969", "4454.896", "0.0", "0.0",
  //  "0.0", "0", "0.0", "38", "824", "615", "614", "467"]
  var obj = {};
  var counter = 0;
  for (var propName in settings.fieldLabels) {
    obj[propName] = row[counter];
    counter++;
  };
  return obj;
}

/**
 * Map a frame.
 */
function mapFrame(frame) {
  if (frame['fixGPS'] === "A") {
    var latGPSFormat = convertGPSToDecimal(frame['latGPS']);
    var longGPSFormat = convertGPSToDecimal(frame['longGPS']);

    var icon = getSpeedIcon(parseInt(frame['speedGPS']));
    var height = parseInt(frame['altGPS']);
    if ((highestAltitude > (height + 300)) && !bursted) {
      icon = burstIcon;
      bursted = true;
    } else {
      highestAltitude = height;
    }

    var marker = L.marker([latGPSFormat, longGPSFormat], {icon: icon})
    /* Remplissage du pop-up du marker */
    .bindPopup(getPopUpFromFrame(frame ));
    markers.addLayer(marker).addTo(map);
  }
}

function getPopUpFromFrame(frame){
  var result = '<div style="color : black">' +
                 '<center>Point ' + frame['frameCounter'] + '</center><br/>' +
                 '<center>' + frame['date'] + '</center><br/>' +
                 '<u><b>Location</b></u><br/>' +
                    '<b>Latitude</b> : ' + frame['latGPS'] + '<br/>' +
                    '<b>Longitude</b> : ' + frame['longGPS'] + '<br/>' +
                    '<b>Altitude</b> : ' + frame['altGPS'] + ' ' + settings.fieldUnits['altGPS'] + '<br/>' +
                 '<u><b>Data</b></u>' + '<br/>' +
                    '<b>Speed</b> : ' + frame['speedGPS'] + ' ' + settings.fieldUnits['speedGPS'] + '<br/>' +
                    '<b>Pressure:</b> : ' + frame['differentialPressureAnalogSensor'] + ' ' + settings.fieldUnits['differentialPressureAnalogSensor'] + '<br/>' +
                    '<b>Temperature out</b> : ' + frame['externalTemperatureAnalogSensor'] + ' ' + settings.fieldUnits['externalTemperatureAnalogSensor'] + '<br/>' +
                    '<b>Temperature in</b> : ' + frame['internalTemperatureAnalogSensor'] + ' ' + settings.fieldUnits['internalTemperatureAnalogSensor'] + '<br/>' +
    				"<b>Temperature middle</b> : " + (frame['middleTemperatureAnalogSensor']) + '' + ' '+ settings.fieldUnits['middleTemperatureAnalogSensor'] + "<br/>" + 
           			"<b>Humidity</b> : " + (frame['externalHumidityAnalogSensor']) + '' + ' '          + settings.fieldUnits['externalHumidityAnalogSensor'] + "<br/>" + 
            		"<b>Voltage</b> : " + (frame['voltageAnalogSensor']) + '' + ' ' + settings.fieldUnits['voltageAnalogSensor'] + "<br/>"; + "</div>";
    return result;
}

/**
 * updateSummary: Update the summary (last received measures) on the main page.
 */
function updateSummary(frame) {
  var measures = [];
  settings.dataBriefLabels.forEach(function(label, index, array) {
    measures.push(frame[label]);
  });
  $('#type-1').replaceWith('<td>' + measures.join('</td><td>') + '</td>');
}

/**
 * // convertGPSToDecimal : convert DDDMM.MM / 0DDMM.MM / 00DMM.MM GPS to
 * decimal GPS // IN : GPS coordinates in DDDMM.MM foramt // OUT : GPS
 * coordinates in decimal foramt
 */
function convertGPSToDecimal(GPS) {
  var pe;
  var neg;
  var pd;
  if (GPS < 0) {
     pe = -Math.ceil(GPS);
     pd = -GPS - pe;
     neg = true;
  } else {
    pe = Math.floor(GPS);
    pd = GPS - pe;
    neg = false;
  }
  // pe et pd sont positifs
  var degres = Math.floor(pe / 100);
  var minutes = pe % 100;
  var ddeg = +degres + ((+minutes + pd)/60*100)/100;
  if (neg) {
    return (-ddeg);
  } else {
    return ddeg;
  }
}

/**
 * // guessCapImgName : get the cap icon name according to the GPS cap // IN :
 * GPS cap // OUT : image name corresponding to the cap
 */
function guessCapImgName(cap) {
  if (cap == 'null' || cap == '' || cap == null) {
    return 'null';
  }
  cap = Number(cap) + 22.5;

  if (cap > 360) {
    cap = 0;
  }
  return (Math.floor(cap / 45) * 45) + '.png';
}

// Get the icon depending on the GPS speed.
function getSpeedIcon(speedGPS) {
  if (speedGPS > 75) {
    return redIcon;
  }
  if (speedGPS > 50) {
    return orangeIcon;
  }
  if (speedGPS > 25) {
    return greenIcon;
  }
  if (speedGPS > 5) {
    return blueIcon;
  }
  return greyIcon;
}

/**
 * // filterData : calibrate the data // IN : the not calibrated data // OUT :
 * the calibrated data
 */
function filterData(dataArg) {
  var data = $.extend({}, dataArg);

  // Adjust values according to sensor calibration.
  for (i in settings.sensorCalibration) {
    if (data[i] != null) {
      data[i] = (parseFloat(data[i]) * settings.sensorCalibration[i][0]) + settings.sensorCalibration[i][1];
    } else {
      data[i] = 0;
    }
  }

  // Parse timestamp.
  data['date'] = dateFormat(new Date(parseInt(data['date'])), "HH:MM:ss");

  // Parse numbers.
  for (var i in settings.fieldFixedPoints) {
    if (data[i] != null) {
      data[i] = parseFloat(data[i]).toFixed(settings.fieldFixedPoints[i]);
    }
  }

  // "Cross" icons for invalid GPS data.
  if (data['fixGPS'] == "V") {
    data['GPSTime'] = "<img src=\"ressources/img/null.png\">";
    data['fixGPS'] = "<img src=\"ressources/img/null.png\">";
    data['longGPS'] = "<img src=\"ressources/img/null.png\">";
    data['latGPS'] = "<img src=\"ressources/img/null.png\">";
    data['altGPS'] = "<img src=\"ressources/img/null.png\">";
    data['speedGPS'] = "<img src=\"ressources/img/null.png\">";
    data['capGPS'] = "<img src=\"ressources/img/null.png\">";
    data['numSatsGPS'] = "<img src=\"ressources/img/null.png\">";
    data['hdop'] = "<img src=\"ressources/img/null.png\">";
  }
  return data;
}

/* Load a JavaScript or JSON file to use its data */
function loadJsFile(filename, callback){
  console.log("Reloading events");
  var body = document.getElementsByTagName("body")[0];
  var fileref = document.getElementById('events-file');
  body.removeChild(fileref);

  // Recreate the node from scratch to make sure the file is reloaded.
  fileref = document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
  fileref.setAttribute("id", "events-file");
  fileref.onload = callback;

  body.appendChild(fileref);
}

// Get the new data from the file (if any).
function getNewData() {
  var newData = [];
  var timestamp;
  for (var i = 0; i < data.length; i++) {
    timestamp = data[i][0];
    if (timestamp > latestTimestamp) {
      newData.push(data[i]);
    } else {
      break;
    }
  };
  return newData;
}

/*
 * Handles the pages dynamic refresh.
 * If it detects the offline mode, the reload process is not triggered.
 * Handled pages:
 * /index.html
 * /data-filtered-all.html
 * /data-raw-all.html
 * /charts.html
 * /map-online.html
 * If the page is not handled, throws an error.
 */ 
function handlePageUpdate() {
	var sPath = window.location.pathname;
	var page_name = sPath.substring(sPath.lastIndexOf('/') + 1);
	var callbackFunction = null;
  var intervalFunction = null;
  var raw = false;
	switch(page_name)
	{
		case "index.html":
		case "map-online.html":
      intervalFunction = function(){

        updateData(getNewData(), mapFrame);
      }
      callbackFunction = mapFrame;
		  break;

		case "data-filtered-all.html":
      intervalFunction = function(){
        updateData(getNewData(), updateTable);
      }
      callbackFunction = updateTable;
			break;
		case "data-raw-all.html":
      intervalFunction = function(){
        updateData(getNewData(), updateTable, true);
      }
      callbackFunction = updateTable;
      raw = true;
		  break;

		case "charts.html":
		  intervalFunction = function() { 
	        updateData(getNewData(), function(){});
          displayChart(); 
	      };
        callbackFunction = function(){};
        raw = false;
	      break;

		default:
			throw "PAGE NOT HANDLED BY common.js:handlePageUpdate()";
	}
  
  updateData(data, callbackFunction, raw);  //we need this one to let the leaflet API correctly.

	if(navigator.onLine) {
    	var reloadTimer = window.setInterval(function() { loadJsFile('data/events.clean', intervalFunction);}, 30000);
	}
}
