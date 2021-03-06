//  commons.js
//  Main functions to handle the data processing
//--------------------------------------------------------------------------------
//  Variables :
//  Allow the user to quickly tune the website configuration
//--------------------------------------------------------------------------------
'use strict';

var rawData = []; // List of raw events.
var filteredData = []; // List of events, filtered and processed.
var latestFrame = 0; // Store EPOCH in the latest timestamp.
var highestAltitude = 0; // Highest altitude attained.
var bursted = false; // Has the balloon poped yet?

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
  for (var i = data.length - 1; i >= 0; i--) {
    var row = data[i];
    if ($.isArray(row) && row.length == Object.keys(settings.fieldLabels).length) {
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
  if (data.length) { // There's at least one event.
    updateSummary(filteredData[filteredData.length - 1]);
    latestFrame = data[0][3];
    console.log("Updated latest frame: " + parseInt(latestFrame));
  }
}

/**
 * createFrameObj : extract the data from the JSON and add labels to it
 */
function createFrameObj(row) {
  // Initialize a frame object from raw json data.

  // Exemple row:
  // (to be completed)
  
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
    if ((highestAltitude > (height + 300)) && frame['numSatsGPS'] >= "4" && !bursted) {
      icon = burstIcon;
      bursted = true;
    } else {
      highestAltitude = height;
    }

    var marker = L.marker([latGPSFormat, longGPSFormat], {
      icon: icon
    })
    /* Filling pop-up */
    .bindPopup(getPopUpFromFrame(frame));
    markers.addLayer(marker).addTo(map);
  }
}

function getPopUpFromFrame(frame) {
  var result = '<div class="popup">' +
    '<center>Frame #' + frame['frameCounter'] + ' at ' + frame['timestamp'] + '</center><br/>' +
    '<u><b>Location</b></u><br/>' +
    '<b>Latitude</b> : ' + formatGPSCoordinates(frame['latGPS']) + '<br/>' +
    '<b>Longitude</b> : ' + formatGPSCoordinates(frame['longGPS']) + '<br/>' +
    '<b>Altitude</b> : ' + frame['altGPS'] + ' ' + settings.fieldUnits['altGPS'] + '<br/>' +
    '<b>Speed</b> : ' + frame['speedGPS'] + ' ' + settings.fieldUnits['speedGPS'] + '<br/>' +
    '<b>Course</b> : ' + frame['courseGPS'] + ' ' + settings.fieldUnits['courseGPS'] + '<br/>' + '<br/>' +
    '<u><b>Data</b></u>' + '<br/>' +    
    '<b>Pressure:</b> : ' + frame['differentialPressureAnalogSensor'] + ' ' + settings.fieldUnits['differentialPressureAnalogSensor'] + '<br/>' +
    '<b>Temperature out</b> : ' + frame['externalTemperatureAnalogSensor'] + ' ' + settings.fieldUnits['externalTemperatureAnalogSensor'] + '<br/>' +
    '<b>Temperature in</b> : ' + frame['internalTemperatureAnalogSensor'] + ' ' + settings.fieldUnits['internalTemperatureAnalogSensor'] + '<br/>' +
    "<b>Temperature board</b> : " + (frame['boardTemperatureAnalogSensor']) + '' + ' ' + settings.fieldUnits['boardTemperatureAnalogSensor'] + "<br/>" +
    "<b>Temperature LiPo</b> : " + (frame['batteryTemperatureAnalogSensor']) + '' + ' ' + settings.fieldUnits['batteryTemperatureAnalogSensor'] + "<br/>" +
    "<b>Humidity</b> : " + (frame['externalHumidityAnalogSensor']) + '' + ' ' + settings.fieldUnits['externalHumidityAnalogSensor'] + "<br/>" +
    "<b>Voltage</b> : " + (frame['batteryVoltageAnalogSensor']) + '' + ' ' + settings.fieldUnits['voltageAnalogSensor'] + "<br/>"; + "</div>";
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
  $('#type-1').html('<td>' + measures.join('</td><td>') + '</td>');
}

/**
 * // convertGPSToDecimal : convert DDDMM.MM / 0DDMM.MM / 00DMM.MM GPS to
 * decimal GPS // IN : GPS coordinates in DDDMM.MM format // OUT : GPS
 * coordinates in decimal format
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
  var ddeg = +degres + ((+minutes + pd) / 60 * 100) / 100;
  if (neg) {
    return (-ddeg);
  } else {
    return ddeg;
  }
}

/**
 * // guessCapImgName : get the cap icon name according to the GPS course 
 * // IN : GPS course 
 * // OUT : image name corresponding to the course
 */
function guessCapImgName(course) {
  if (course == 'null' || course == '' || course == null) {
    return 'null';
  }
  course = Number(course) + 22.5;

  if (course > 360) {
    course = 0;
  }
  return (Math.floor(course / 45) * 45) + '.png';
}

// Get the icon depending on the GPS speed.
function getSpeedIcon(speedGPS) {
  if (speedGPS > settings.mapFlags['red']) {
    return redIcon;
  }
  if (speedGPS > settings.mapFlags['orange']) {
    return orangeIcon;
  }
  if (speedGPS > settings.mapFlags['green']) {
    return greenIcon;
  }
  if (speedGPS > settings.mapFlags['blue']) {
    return blueIcon;
  }
  return whiteIcon;
}

/**
 * // filterData : calibrate the data // IN : the not calibrated data // OUT :
 * the calibrated data
 */
function filterData(dataArg) {
  var data = $.extend({}, dataArg);

  // Adjust values according to sensor calibration.
  for (var i in settings.sensorCalibration) {
    if (data[i] != null) {
      data[i] = (parseFloat(data[i]) * settings.sensorCalibration[i][0]) + settings.sensorCalibration[i][1];
    } else {
      data[i] = 0;
    }
  }
  for (var i in settings.fieldFixedPoints) {
    if (data[i] != null) {
      data[i] = parseFloat(data[i]).toFixed(settings.fieldFixedPoints[i]);
    }
  }
  // transform 123456 to 12:34:56
  data.timeRTC = data.timeRTC.replace(/(..)(..)(..)/,'$1:$2:$3');
  data.timeGPS = data.timeGPS.replace(/(..)(..)(..)/,'$1:$2:$3');
  data.timestamp =  moment( parseInt(data.timestamp,10) ).format('HH:mm:ss');


  // "Cross" icons for invalid GPS data.
  if (data['fixGPS'] == "V") {
    settings.gpsFields.forEach(function(element, index, array) {
      data[element] = "-";
    });
  }
  return data;
}

/* Load a JavaScript or JSON file to use its data */
function loadJsFile(filename, callback) {
  console.log("Reloading events");
  var body = document.getElementsByTagName("body")[0];
  var fileref = document.getElementById('events-file');
  body.removeChild(fileref);

  // Recreate the node from scratch to make sure the file is reloaded.
  fileref = document.createElement('script');
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", filename);
  fileref.setAttribute("id", "events-file");
  fileref.onload = callback;

  body.appendChild(fileref);
}

// Get the new data from the file (if any).
function getNewData() {
  var newData = [];
  var frameNum;
  for (var i = 0; i < data.length; i++) {
    frameNum = data[i][3];
    if (frameNum > latestFrame) {
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
  var loadJSCallbackFunction = null;
  var optionnalFunction = function() {};
  var raw = false;
  switch(page_name)
  {
    case "":
    case "index.html":
    case "map-online.html":
    case "map-offline.html":
      loadJSCallbackFunction = function(){
        updateData(getNewData(), mapFrame);
      }
      callbackFunction = mapFrame;
      break;

    case "data-filtered-all.html":
      loadJSCallbackFunction = function() {
        updateData(getNewData(), updateTable);
      }
      callbackFunction = updateTable;
      var optionnalFunction = function() {
        $(function() {
          //$("table").tablesorter();
        });
      };
      break;
    case "data-raw-all.html":
      loadJSCallbackFunction = function() {
        updateData(getNewData(), updateTable, true);
      }
      callbackFunction = updateTable;
      raw = true;
      var optionnalFunction = function() {
        $(function() {
          //$("table").tablesorter();
        });
      };
      break;

    case "charts.html":
      loadJSCallbackFunction = function() {
        updateData(getNewData(), function() {});
        displayChart();
      };
      callbackFunction = function() {};
      optionnalFunction = displayChart;
      raw = false;
      break;


    default:
      throw "PAGE NOT HANDLED BY common.js:handlePageUpdate()";
      alert(page_name);
  }

  updateData(data, callbackFunction, raw); //we need this one to let the leaflet API starts correctly.
  optionnalFunction();

  if (navigator.onLine) {
    var reloadTimer = window.setInterval(function() {
      loadJsFile('data/events.clean', loadJSCallbackFunction);
      optionnalFunction();
    }, 30000);
  }
}


function formatGPSCoordinates(coordinates) {
  var dotIndex = coordinates.indexOf('.');
  var first = coordinates.substring(0, dotIndex - 2);
  if (first == "") {
    first = "0";
  }
  var second = coordinates.substring(dotIndex - 2, dotIndex);
  var rest = coordinates.substring(dotIndex);

  return (first + "&deg;" + second + rest);
}
