//	commons.js
//	Main functions to handle the data processing
//--------------------------------------------------------------------------------
//	Varaiables :
//	Allow the user to quickly tune the website configuration
//--------------------------------------------------------------------------------

/*
 * Path of the JSON file. WARNING > The path is
 * from the location of the HTML page which uses
 * the script, not from the script's location !
 */

jsonPath = 'data/events.clean';
jsonFrameLength = 29; /* Number of fields in the json : 23 for the 2013 flight */
sensorCalibration =
{ /*
     * An array containing the name of the data and a, b as calibratedData =
     * (data * a) + b
     */
    "internalTemperatureAnalogSensor" : [ 0.1701, -56.66 ],
    "middleTemperatureAnalogSensor" : [ 0.1701, -56.66 ],
    "externalTemperatureAnalogSensor" : [ 0.1701, -56.66 ],
    "externalHumidityAnalogSensor" : [ 1, 3 ],
    "differentialPressureAnalogSensor" : [ -1.2207, 1284 ],
    "upLuminosityAnalogSensor" : [ 1, 5 ],
    "side1LuminosityAnalogSensor" : [ 1, 6 ],
    "side2LuminosityAnalogSensor" : [ 1, 7 ],
    "soundLevelAnalogSensor" : [ 1, 8 ],
    "batteryTemperatureAnalogSensor" : [ 1, 9 ],
    "voltageAnalogSensor" : [ 0.0097, 0 ],
    "speedGPS" : [ 1.852, 0 ]
};
// --------------------------------------------------------------------------------
// End of Variables
// --------------------------------------------------------------------------------

var UBPE = {}

UBPE.__DEBUG__ = true;
UBPE.dataFile = jsonPath;
UBPE.timeout = 13000;
UBPE.stations = [];
UBPE.error = false;
UBPE._timers = {};
UBPE.timer = function(name, fn, time)
{
    var timer = setTimeout(fn, time || UBPE.timeout);

    if (UBPE._timers[name])
    {
	clearTimeout(UBPE._timers[name]);
    }

    UBPE._timers[name] = timer;

    return timer;
};
UBPE.clearTimer = function(name)
{
    if ($.isArray(name))
    {
	for (key in name)
	{
	    UBPE.clearTimer(name[key]);
	}
    }
    else
    {
	if (UBPE._timers[name])
	{
	    clearTimeout(UBPE._timers[name]);
	}
    }
};

UBPE._onPageUnload = function()
{
    for (key in UBPE._timers)
    {
	if (UBPE._timers[key])
	{
	    clearTimeout(UBPE._timers[key]);
	}
    }

    UBPE._timers = {};
};

function getFile(file)
{
    var data = [];

    $.ajax(
    {
	url : file + '?' + $.now(), // Inutile, vu que "cache: false" ?
	async : false,
	dataType : 'text', // Pas 'json' !!!
	cache : false
    }).done(
	    function(text)
	    {
		try
		{
		    var newText = text.replace(/\](\s*)\[/, '],$1[') // "]["
		    // -->
		    // "],["
		    .replace(/,(\s*),/, ',null$1,') // ",," --> ",null,"
		    .replace(/,(\s*)\]/, ',null$1]') // ",]" -->
		    // ",null]"
		    .replace(/\[(\s*),/, '[null$1,') // "[," -->
		    // "[null,"
		    ;

		    var json = jQuery.parseJSON(newText);

		    if (!$.isArray(json))
		    {
			data = false;
		    }
		    else
		    {
			var invalidLine = false;

			for (k in json)
			{
			    if ($.isArray(json[k]) && json[k].length == jsonFrameLength)
			    {
				data.push(createTrameObj(json[k]));
			    }
			    else
			    {
				invalidLine = true;
			    }
			}

			if (invalidLine && UBPE.__DEBUG__)
			{
			    alert('Attention, des lignes mal formées ont été ignorées.');
			}
		    }
		}
		catch (e)
		{
		    alert('Le fichier "' + file + '" contient une erreur de syntaxe qui n\'a pas pu être corrigée.\n\nErreur:\n' + e
			    + '\n\nLes données n\'ont pas été chargées.');
		    data = false;
		}
	    }).error(function()
    {
	data = false;
    });

    return data;
}

/**
 * // createTramObj : extract the data from the JSON and add a labels to it //
 * IN : // OUT :
 */
function createTrameObj(row)
{
    var date = row[0] ? new Date(row[0]) : null;

    // "1367221880630", "IUT-Radio", "STRATERRESTRE",
    // "148", "0", "0", "801", "84", "271658", "001128", "V",
    // "454.969", "4454.896", "0.0", "0.0", "0.0", "0", "0.0",
    // "38", "824", "615", "614", "467"
    var obj =
    { // Name of field: row of the field
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
	internalTemperatureAnalogSensor : row[18],
	middleTemperatureAnalogSensor : row[19],
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
 * // convertGPSToDecimal : convert DDDMM.MM / 0DDMM.MM / 00DMM.MM GPS to
 * decimal GPS // IN : GPS coordinates in DDDMM.MM foramt // OUT : GPS
 * coordinates in decimal foramt
 */
function convertGPSToDecimal(GPS)
{
    var pe;
    var neg;
    var pd;
    if (GPS < 0) {
	   pe = -Math.ceil(GPS);
	   pd = -GPS - pe;
	   neg = true;	
    }
    else {
	  pe = Math.floor(GPS);
	  pd = GPS - pe;
      neg = false;	
	}
    // pe et pd sont positifs
    var degres = Math.floor(pe / 100); 
    var minutes = pe % 100; 
    var ddeg = +degres + ((+minutes + pd)/60*100)/100;
    if (neg) return (-ddeg);
    else return ddeg;
}
/**
 * Met à jour les données et retourne les nouvelles
 * 
 */
function updateData()
{
    var newData = [];
    var newRawData = getFile(UBPE.dataFile);

    if (false == newRawData)
    {
	newRawData = [];
	UBPE.error = true;
    }
    else
    {
	UBPE.error = false;
    }

    for (key in newRawData)
    {
	var d = filterData(newRawData[key]);
	var st = $.trim(d.stationName);
	newData.push(d);

	if ('' != st && -1 == jQuery.inArray(st, UBPE.stations))
	{
	    UBPE.stations.push(st);
	}
    }

    // format:off
    return  {raw : newRawData, filtered : newData};
    // format:on
}

function errorAccessFile()
{
    alert("Erreur d'accès au fichier '" + UBPE.dataFile + "', actualisez la page.");
}

/**
 * // guessCapImgName : get the cap icon name according to the GPS cap // IN :
 * GPS cap // OUT : image name corresponding to the cap
 */
function guessCapImgName(cap)
{
    if (cap == 'null' || cap == '' || cap == null)
    {
	name = 'null';
    }
    else if (cap > 337.5 && cap <= 22.5 || cap == 0)
    {
	name = 'up';
    }
    else if (cap > 22.5 && cap <= 67.5)
    {
	name = 'rightup';
    }
    else if (cap > 67.5 && cap <= 112.5)
    {
	name = 'right';
    }
    else if (cap > 112.5 && cap <= 157.5)
    {
	name = 'rightdown';
    }
    else if (cap > 157.5 && cap <= 202.5)
    {
	name = 'down';
    }
    else if (cap > 202.5 && cap <= 247.5)
    {
	name = 'leftdown';
    }
    else if (cap > 247.5 && cap <= 292.5)
    {
	name = 'left';
    }
    else if (cap > 292.5 && cap <= 337.5)
    {
	name = 'leftup';
    }

    return name + '.png';
}

/**
 * // guessSpeedIconName : get the point icon name according to the GPS speed //
 * IN : GPS speed // OUT : image name corresponding to the speed
 */
function guessSpeedIconName(speedGPS)
{
    if (speedGPS == null || speedGPS == '' || speedGPS == 0 || speedGPS <= 0)
    {
	name = 'grey';
    }
    else if (speedGPS > 0 && speedGPS <= 20)
    {
	name = 'blue';
    }
    else if (speedGPS > 20 && speedGPS <= 50)
    {
	name = 'green';
    }
    else if (speedGPS > 50 && speedGPS <= 150)
    {
	name = 'orange';
    }
    else if (speedGPS > 150)
    {
	name = 'red';
    }

    return name + "Icon";
}

/**
 * // filterData : calibrate the data // IN : the not calibrated data // OUT :
 * the calibrated data
 */
function filterData(dataArg)
{

    var data = $.extend({}, dataArg);

    for (i in sensorCalibration)
    {
	if (data[i] != null)
	{
	    data[i] = (parseFloat(data[i]) * sensorCalibration[i][0]) + sensorCalibration[i][1];
	}
	else
	    data[i] = 0;
    }

    data['date'] = dateFormat(new Date(parseInt(data['date'])), "HH:MM:ss");

    for (i in settings.fieldFixedPoints)
    {
	if (data[i] != null)
	    data[i] = parseFloat(data[i]).toFixed(settings.fieldFixedPoints[i]);
    }
    if (data['fixGPS'] == "V")
    {
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

$(document).ready(function()
{

    $('nav ul li a').live('click', function()
    {
	var url = $(this).attr('href');
	$.ajax(url).done(function(data)
	{
	    // UBPE.lastDates =
	    // []; NE PAS
	    // REMETTRE A ZERO
	    // AU CHANGEMENT DE
	    // PAGE !!!
	    UBPE._onPageUnload();
	    $('#content_wrapper').css('height', $('#content').height());
	    $('#content').fadeOut(function()
	    {
		$('#content').html(data);
		$('#content').fadeIn(function()
		{
		    $('#content_wrapper').css('height', $('#content').height());
		});
	    });
	}).error(function()
	{
	    alert("Page introuvable.");
	});
	return false;
    });

});
