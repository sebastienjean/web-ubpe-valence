//	commons.js
//	Main functions to handle the data processing
//--------------------------------------------------------------------------------
//	Varaiables :
//	Allow the user to quickly tune the website configuration
//--------------------------------------------------------------------------------
jsonPath = 'data/events.clean'; /*
				 * Path of the JSON file. WARNING > The path is
				 * from the location of the HTML page which uses
				 * the script, not from the script's location !
				 */
jsonFrameLength = 23; /* Number of fields in the json : 23 for the 2013 flight */
sensorCalibration =
{ /*
     * An array containing the name of the data and a, b as calibratedData =
     * (data * a) + b
     */
    "differentialPressureAnalogSensor" : [ 1, 1 ],
    "absolutePressureAnalogSensor" : [ 1, 2 ],
    "externalTemperatureAnalogSensor" : [ 1, 3 ],
    "internalTemperatureAnalogSensor" : [ 1, 4 ],
    "voltageAnalogSensor" : [ 0.0097, 0 ],
    "speedGPS" : [ 1.852, 0 ]
};
// --------------------------------------------------------------------------------
// End of Varaiables
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
	differentialPressureAnalogSensor : row[18],
	absolutePressureAnalogSensor : row[19],
	externalTemperatureAnalogSensor : row[20],
	internalTemperatureAnalogSensor : row[21],
	voltageAnalogSensor : row[22]
    };
    return obj;
}

/**
 * // convertGPSToDecimal : convert DDDMM.MM / 0DDMM.MM / 00DMM.MM GPS to
 * deciaml GPS // IN : GPS coordinates in DDDMM.MM foramt // OUT : GPS
 * coordinates in decimal foramt
 */
function convertGPSToDecimal(GPS)
{
    if (GPS[5] == ".")
    { // Format : DDDMM.MM
	var strPartieEntiere = GPS[0] + GPS[1] + GPS[2]; // Get DDD
	var strPartieDecimale = GPS[3] + GPS[4] + GPS[5] + GPS[6] + GPS[7]; // Get
	// MM.MM
    }
    else if (GPS[4] == ".")
    { // Format : 0DDMM.MM
	var strPartieEntiere = GPS[0] + GPS[1]; // Get 0DD
	var strPartieDecimale = GPS[2] + GPS[3] + GPS[4] + GPS[5] + GPS[6]; // Get
	// MM.MM
    }
    else if (GPS[3] == ".")
    { // Format : 00DMM.MM
	var strPartieEntiere = GPS[0]; // Get 00D
	var strPartieDecimale = GPS[1] + GPS[2] + GPS[3] + GPS[4] + GPS[5]; // Get
	// MM.MM
    }
    else
    {
	return ("I don't know how to handle this fucking GPS format !!!")
    }
    var partieEntiere = Number(strPartieEntiere); // Get the integer part
    var partieDecimale = Number(strPartieDecimale) / 60 // Get the float part

    return (Math.round((partieEntiere + partieDecimale) * 1000)) / 1000 // Round
    // 3
    // numbers
    // after
    // coma
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

    return
    {
	raw : newRawData,
	filtered : newData
    };
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
    else if (speedGPS > 0 && speedGPS <= 10)
    {
	name = 'blue';
    }
    else if (speedGPS > 10 && speedGPS <= 20)
    {
	name = 'green';
    }
    else if (speedGPS > 20 && speedGPS <= 50)
    {
	name = 'orange';
    }
    else if (speedGPS > 50)
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
	var sensor = data[i];
	if (sensor != null)
	{
	    data[i] = (data[i] * sensorCalibration[i][0]) + sensorCalibration[i][1];
	}
	else
	    data[i] = 0;
    }

    data['date'] = dateFormat(new Date(parseInt(data['date'])), "HH:MM:ss");

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
