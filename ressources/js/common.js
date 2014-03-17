//  commons.js
//  Main functions to handle the data processing
//--------------------------------------------------------------------------------
//  Varaiables :
//  Allow the user to quickly tune the website configuration
//--------------------------------------------------------------------------------

/*
 * Path of the JSON file. WARNING > The path is
 * from the location of the HTML page which uses
 * the script, not from the script's location !
 */

var jsonPath = 'data/events.clean';
var jsonFrameLength = 29; // Number of fields in the json : 29 for the 2013 flight.
var raw_data = [];  // List of raw events.
var data = [];  // List of events, filtered and processed.

// --------------------------------------------------------------------------------
// End of Variables
// --------------------------------------------------------------------------------


/**
 * Get the (possibly updated) data, store it in raw_data, and store the
 * filtered data in data.
 */
function updateData() {
  $.ajax({url: jsonPath, dataType: 'json', cache: false})
  .done(function(json) {
    if (!$.isArray(json)) {
      console.error("The json received isn't an array: " + json);
      return;
    }

    data = [];
    raw_data = [];
    var frame;
    var filtered;
    json.forEach(function(row, index, array) {
      if ($.isArray(row) && row.length == jsonFrameLength) {
        frame = createFrameObj(row);
        filtered = filterData(frame);
        raw_data.push(frame);
        data.push(filtered);
        mapFrame(filtered, index);
      } else {
        console.warn('Encountered an invalid line (' + index + '): ' + row);
      }
    });
    if (data.length) {  // There's at least one event.
      updateSummary(data[0]);
    }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Failure while parsing the events json "' + jsonPath+ '": ' +
                  errorThrown.message);
  });
}

/**
 * createFrameObj : extract the data from the JSON and add labels to it
 */
function createFrameObj(row) {
  var date = row[0] ? new Date(row[0]) : null;

  // Exemple row:
  // ["1367221880630", "IUT-Radio", "STRATERRESTRE",  "148", "0", "0", "801",
  //  "84", "271658", "001128", "V", "454.969", "4454.896", "0.0", "0.0",
  //  "0.0", "0", "0.0", "38", "824", "615", "614", "467"]
  var obj = { // Name of field: value of the field
    date : row[0],
    stationName : row[1],
    objectName : row[2],
    frameCounter : row[3],
    resetCounter : row[4],
    currentFlightPhaseNumber : row[5],
    currentFlightPhaseDurationInSeconds : row[6],
    secondsSinceLastReset : row[7],
    RTCTime : row[8],
    GPSTime : row[9],
    fixGPS : row[10],
    longGPS : row[11],
    latGPS : row[12],
    altGPS : row[13],
    speedGPS : row[14],
    capGPS : row[15],
    numSatsGPS : row[16],
    hdop : row[17],
    middleTemperatureAnalogSensor : row[18],
    internalTemperatureAnalogSensor : row[19],
    externalTemperatureAnalogSensor : row[20],
    externalHumidityAnalogSensor : row[21],
    differentialPressureAnalogSensor : row[22],
    upLuminosityAnalogSensor : row[23],
    side1LuminosityAnalogSensor : row[24],
    side2LuminosityAnalogSensor : row[25],
    soundLevelAnalogSensor : row[26],
    batteryTemperatureAnalogSensor : row[27],
    voltageAnalogSensor : row[28]
  };
  return obj;
}

/**
 * Map a frame.
 */
function mapFrame(frame, number) {
  if (frame['fixGPS'] === "A") {
    var latGPSFormat = convertGPSToDecimal(frame['latGPS']);
    var longGPSFormat = convertGPSToDecimal(frame['longGPS']);

    // Center on the last point received.
    map.setView(new L.LatLng(latGPSFormat, longGPSFormat), 8);

    /* Remplissage du pop-up du marker */
    L.marker([latGPSFormat, longGPSFormat], {icon: blueIcon})
    .addTo(map)
    .bindPopup('<div style="color : black">' +
                 '<center>Point ' + number + '</center><br/>' +
                 '<center>' + frame['date'] + '</center><br/>' +
                 '<u><b>Location</b></u><br/>' +
                    '<b>Latitude</b> : ' + frame['latGPS'] + '<br/>' +
                    '<b>Longitude</b> : ' + frame['longGPS'] + '<br/>' +
                    '<b>Altitude</b> : ' + frame['altGPS'] + ' ' + settings.fieldUnits['altGPS'] + '<br/>' +
                 '<u><b>Data</b></u>' + '<br/>' +
                    '<b>Speed</b> : ' + frame['speedGPS'] + ' ' + settings.fieldUnits['speedGPS'] + '<br/>' +
                    '<b>Pressure diff.</b> : ' + frame['differentialPressureAnalogSensor'] + ' ' + settings.fieldUnits['differentialPressureAnalogSensor'] + '<br/>' +
                    '<b>Temperature out</b> : ' + frame['externalTemperatureAnalogSensor'] + ' ' + settings.fieldUnits['externalTemperatureAnalogSensor'] + '<br/>' +
                    '<b>Temperature in</b> : ' + frame['internalTemperatureAnalogSensor'] + ' ' + settings.fieldUnits['internalTemperatureAnalogSensor'] + '<br/>' +
               '</div>');
  }
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

/**
 * // guessSpeedIconName : get the point icon name according to the GPS speed //
 * IN : GPS speed // OUT : image name corresponding to the speed
 */
function guessSpeedIconName(speedGPS) {
  if (speedGPS == null || speedGPS == '' || speedGPS <= 5) {
    name = 'grey';
  } else if (speedGPS > 5 && speedGPS <= 20) {
    name = 'blue';
  } else if (speedGPS > 20 && speedGPS <= 50) {
    name = 'green';
  } else if (speedGPS > 50 && speedGPS <= 150) {
    name = 'orange';
  } else if (speedGPS > 150) {
    name = 'red';
  }

  return name + "Icon";
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

function getBurstFrameNumber(rawData) {
  var previousAltitude = -1;

  for (var i=0;i<rawData.length;i++) {
    var j = rawData.length - i - 1;
    if (rawData[j]['fixGPS'] == "V") {
      continue;
    }
    if (rawData[j]['currentFlightPhaseNumber'] < 3) {
      continue;
    }
    // TODO define trigger in settings.js
    if (previousAltitude > +Number(rawData[j]['altGPS']) + 300) {
      return rawData[j+1]['frameCounter'];
    }
    previousAltitude = Number(rawData[j]['altGPS']);
  }
  return -1;
}
