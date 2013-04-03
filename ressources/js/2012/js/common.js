//	commons.js
//	Main functions to handle the data processing
//--------------------------------------------------------------------------------
//	Varaiables :
//	Allow the user to quickly tune the website configuration
//--------------------------------------------------------------------------------
jsonPath = 'data/events.test'; 			/* Path of the JSON file. WARNING > The path is from the location of the HTML page which uses the script, not from the script's location ! */
jsonFrameLength = 23;					/* Number of fiels in the json : 23 for the 2013 flight*/
sensorCalibration = {						/* An array containing the name of the data and a, b as calibratedData = (data * a) + b */
							"sensor1" : [1, 1],
							"sensor2" : [2, 2],
							"sensor3" : [3, 3],
							"sensor4" : [4, 4]
							};
//--------------------------------------------------------------------------------
// End of Varaiables
//--------------------------------------------------------------------------------

var UBPE = {}

UBPE.__DEBUG__ = true;
UBPE.dataFile = jsonPath;
UBPE.lastDates = {};
UBPE.timeout = 13000;
UBPE.data = [];
UBPE.rawData = [];
UBPE.stations = [];
UBPE.error = false;
UBPE._timers = {};
UBPE.timer = function(name, fn, time) {
	var timer = setTimeout(fn, time || UBPE.timeout);

	if(UBPE._timers[name]) {
		clearTimeout(UBPE._timers[name]);
	}
	
	UBPE._timers[name] = timer;
	
	return timer;
};
UBPE.clearTimer = function(name) {
	if($.isArray(name)) {
		for (key in name) {
			UBPE.clearTimer(name[key]);
		}
	}
	else {
		if(UBPE._timers[name]) {
			clearTimeout(UBPE._timers[name]);
		}
	}
};

UBPE._onPageUnload = function() {
	for (key in UBPE._timers) {
		if(UBPE._timers[key]) {
			clearTimeout(UBPE._timers[key]);
		}
	}
	
	UBPE._timers = {};
};


/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}


function getFile (file) {
	var data = [];
	
	$.ajax({
			url: file+'?'+$.now(), // Inutile, vu que "cache: false" ?
			async: false,
			dataType: 'text', // Pas 'json' !!!
			cache: false
	}).done(function (text) {
		try
		{
			var newText = text
				.replace('//@@EVENT@@//', '')      // Suppression du commentaire
				.replace(/\](\s*)\[/, '],$1[')     // "][" --> "],["
				.replace(/,(\s*),/, ',null$1,')    // ",," --> ",null,"
				.replace(/,(\s*)\]/, ',null$1]')   // ",]" --> ",null]"
				.replace(/\[(\s*),/, '[null$1,')   // "[," --> "[null,"
			;
			
			//var json = jQuery.parseJSON(newText);
			/*
				--> C'est pas joli, mais le JSON.parse() sort une exception, 
				je pige pas pourquoi ! (Sous FF, Safari, mais pas sous IE !!)
				
				JSON.parse: expected ',' or ']' after array element
				
				Pourtant, le json est bien formé, et "eval()" marche très bien.
				Une erreur d'encodage ??
			*/
			try {
				var json = eval(' ('+newText+') ');
			}
			catch(e) {
				var newText2 = '';
				for (var i = 0; i < newText.length; i++) {
					var ascii = newText.charCodeAt(i);
					
					if((ascii >= 32 && ascii <= 126) || ascii == 10 || ascii == 9) {
						newText2 += newText.charAt(i);
					}
					else {
						newText2 += '0';
					}
				}
				
				var json = eval(' ('+newText2+') ');
			}
		
			if(!$.isArray(json)) {
				data = false;
			}
			else {
				var invalidLine = false;
				
				for (k in json) {
					if($.isArray(json[k]) && json[k].length == jsonFrameLength) {
						data.push(createTrameObj(json[k]));
					}
					else {
						invalidLine = true;
					}
				}
				
				if(invalidLine && UBPE.__DEBUG__) {
					alert('Attention, des lignes mal formées ont été ignorées.');
				}
			}
		}
		catch(e)
		{
			alert('Le fichier "'+file+'" contient une erreur de syntaxe qui n\'a pas pu être corrigée.\n\nErreur:\n'+e+'\n\nLes données n\'ont pas été chargées.');
			data = false;
		}
	}).error(function() {
		data = false;
	});
	
	return data;
}

function parseCoo (coo) {
	if(typeof(coo) == 'undefined' || null == coo) {
		return null;
	}

	var c = parseFloat(coo.substring(0, coo.length-1)) / 100;
	var m = Math.floor(c);
	var dm = ((c - m) * 100) / 60;
	var f = m + dm;
	var l = coo.substring(coo.length-1, coo.length);
	
	if (l == 'S' || l == 'O')
		f = -f;

	return Math.round(f * 1000000) / 1000000;
}
/**
// createTramObj : extract the data from the JSON and add a labels to it
// IN	: 
// OUT 	: 
*/
function createTrameObj (row) {
	var date = row[0] ? new Date(row[0]) : null;
	
	var obj = { //Name of field: row of the field
		date:    	row[0],
		stationName:  	row[1],
		objectName:   	row[2],
		frameCounter:	row[3],
		resetCounter:	row[4],
		currentFlightPhase:			row[5],
		currentFlightPhaseDuration:	row[6],
		systemTimeReset:			row[7],
		RTCTime:	row[8],
		GPSTime:	row[9],
		fixGPS:		row[10],
		longGPS:	row[11],
		latGPS: 	row[12],
		altGPS:		row[13],
		speedGPS:	row[14],
		capGPS:		row[15],
		numSatsGPS:	row[16],
		hdop:		row[17],
		sensor1:	row[18],
		sensor2:	row[19],
		sensor3:	row[20],
		sensor4:	row[21],
		voltage: 	row[22]
	};
	return obj;
}

/**
//	realDate : get a formated date from the epoc date
//	IN 	: an epoc date
//	OUT	: the date formated
*/
function realDate (epoc){
    var d = new Date();
    d.setTime(epoc * 1000);
    return d;
}

function getData (file) {
	var json = getFile(file);
	if (json !== false)
	{
		var lastDate = 0;
		for (key in json)
		{
			if (json[key].date > lastDate) {
				lastDate = json[key].date;
			}
		}
		
		UBPE.lastDates[file] = lastDate;
	}
	return json;
}

function getNewData(file) {
	var json = getFile(file);
	if (json === false) {
		return false;
	}
	else {
		var newData = [];
		if (typeof(UBPE.lastDates[file]) != 'undefined')
		{
			var newLastDate = lastDate = UBPE.lastDates[file];
			for (key in json)
			{
				if (json[key].date > lastDate)
				{
					if (json[key].date > newLastDate)
						newLastDate = json[key].date;
					newData.push(json[key]);
				}
			}
			UBPE.lastDates[file] = newLastDate;
			return newData;
		}
		else
			return getData(file);
	}
}

/**
 * Met à jour les données et retourne les nouvelles
 *
 */
function updateData () {
	var newData = [];
	var newRawData = getNewData(UBPE.dataFile);
	//alert(UBPE.dataFile +': '+newRawData.length);
	
	if(false == newRawData) {
		newRawData = [];
		UBPE.error = true;
	}
	else {
		UBPE.error = false;
	}
	
	if(newRawData && newRawData.length) {
		UBPE.rawData = $.merge( UBPE.rawData, newRawData );

		for (key in newRawData) {
			var d = filterData(newRawData[key]);
			var st = $.trim(d.stationName);
			newData.push(d);
			
			if('' != st && -1 == jQuery.inArray(st, UBPE.stations)) {
				UBPE.stations.push( st );
			}
		}
		
		UBPE.data = $.merge( UBPE.data, newData );
	}
	
	/*var newData = [];
	for(k in newRawData) {
		newData[k] = filterData(newRawData[k]);

		if(-1 == jQuery.inArray(newData[k].stationName, UBPE.stations)) {
			UBPE.stations.push( newData[k].stationName );
		}
	}*/
	
	return {
		raw: newRawData,
		filtered: newData
	};
}

function errorAccessFile () {
	alert("Erreur d'accès au fichier '"+UBPE.dataFile+"', actualisez la page.");
}
	
function retrieveChartSeries(data, property) {
	var series = [];
	
	$.each(data, function(k,v) {
		series.push( v[property] );
	});
	
	return series;
}

/**
 * Retourne une image correspondant au cap donné
 *
 * @param int cap Le cap, valeur entre 0 et 360
 */
function guessCapImgName(cap) {
	if(cap == 'null' || cap == '' || cap == null) {
		name = 'question';
	}

	else if(cap > 337.5 && cap <= 22.5) {
		name = 'up';
	}
	else if(cap > 22.5 && cap <= 67.5) {
		name = 'rightup';
	}
	else if(cap > 67.5 && cap <= 112.5) {
		name = 'right';
	}
	else if(cap > 112.5 && cap <= 157.5) {
		name = 'rightdown';
	}
	else if(cap > 157.5 && cap <= 202.5) {
		name = 'down';
	}
	else if(cap > 202.5 && cap <= 247.5) {
		name = 'leftdown';
	}
	else if(cap > 247.5 && cap <= 292.5) {
		name = 'left';
	}
	else if(cap > 292.5 && cap <= 337.5) {
		name = 'leftup';
	}
	
	return name+'.png';
}

function guessSpeedIconName(speedGPS){
	if(speedGPS == null || speedGPS == '' || speedGPS == 0 || speedGPS <= 0) {
		name = 'grey';
	}
	else if(speedGPS > 0 && speedGPS <= 10) {
		name = 'blue';
	}
	else if(speedGPS > 10 && speedGPS <= 20) {
		name = 'green';
	}
	else if(speedGPS > 20 && speedGPS <= 50) {
		name = 'orange';
	}
	else if(speedGPS > 50) {
		name = 'red';
	}
	
	return name + "Icon";
}

/* Return time in an array [[h,m,s],[h,m,s],...] */
function getTimeArray(json){
	var tabTime = new Array();
	for ( i = 0; i < (json['filtered'].length); i++){
		tabTime.push(	[(json['filtered'][i]['timeGPSFormat']).split(" ")[4].split(":")[0],
						(json['filtered'][i]['timeGPSFormat']).split(" ")[4].split(":")[1],
						(json['filtered'][i]['timeGPSFormat']).split(" ")[4].split(":")[2]]
						);
	}
	return tabTime;
}

/* Get the time of the first and last data received and the duration of the flight ([h, m, s])*/
function getTimeBonds(json){
	tabTime = new Array();
	tabTime = getTimeArray(json);
	
	var minH = tabTime[0][0]; var maxH = tabTime[0][0]; var durH = 0;
	var minM = tabTime[0][1]; var maxM = tabTime[0][1]; var durM = 0;
	var minS = tabTime[0][2]; var maxS = tabTime[0][2]; var durS = 0;
	
	/* Get the min and max time */
	for (i = 1; i < (tabTime.length); i++){
		if ((tabTime[i][0] > maxH) || (tabTime[i][0] >= maxH && tabTime[i][1] > maxM ) || (tabTime[i][0] >= maxH && tabTime[i][1] >= maxM && tabTime[i][2] > maxS)){
			maxH = tabTime[i][0];
			maxM = tabTime[i][1];
			maxS = tabTime[i][2];
		}
		if ((tabTime[i][0] < maxH) || (tabTime[i][0] <= maxH && tabTime[i][1] < maxM ) || (tabTime[i][0] <= maxH && tabTime[i][1] <= maxM && tabTime[i][2] < maxS)){
			minH = tabTime[i][0];
			minM = tabTime[i][1];
			minS = tabTime[i][2];
		}
	}
	
	/* Seconds */
	durS = maxS - minS;
	if (durS >= 60){
		durS = durS % 60;
		durM += 1;
	}
	else if (durS < 0){
		durM -= 1;
		durS = 60 + durS;
	}
	
	/* Minutes */
	durM += (maxM - minM);
	if (durM >= 60){
		durM = durM % 60;
		durH += 1;
	}
	else if (durM < 0){
		durH -= 1;
		durM = 60 + durM;
	}
	
	/* Hours */
	durH += (maxH - minH);
	
	return ({"min" : [minH, minM, minS], "max" : [maxH, maxM, maxS], "duration" : [durH+"", durM+"", durS+""], "flight" : "Pas encore codé !"});
}

function volt(val, round) {
	var U = 5 * val / 1024;

	if(round) {
		return Math.round( U * 1000) / 1000;
	}
	else {
		return U;
	}
}

/**
//	filterData : calibrate the data
// IN	: the not calibrated data
// OUT 	: the calibrated data
*/
function filterData(dataArg) {
		
	var data = $.extend({}, dataArg);

	if(data.sensor1 != null) {
		data.sensor1 = ((data.sensor1 * sensorCalibration['sensor1'][0]) + sensorCalibration['sensor1'][1]);
	}

	if(data.sensor2 != null) {
		data.sensor2 = ((data.sensor2 * sensorCalibration['sensor2'][0]) + sensorCalibration['sensor2'][1]);
	}
	
	if(data.sensor3 != null) {
		data.sensor3 = ((data.sensor3 * sensorCalibration['sensor3'][0]) + sensorCalibration['sensor3'][1]);
	}

	if(data.sensor4 != null) {
		data.sensor4 = ((data.sensor4 * sensorCalibration['sensor4'][0]) + sensorCalibration['sensor4'][1]);
	}
	
	if(data.voltage != null) {
		data.voltage = Math.round( (volt(data.voltage) * 2) * 1000) / 1000; // convert to a real voltage
	}
	
	if(data.speedGPS != null) {
		data.speedGPS = Math.round( (data.speedGPS * 1.852) * 100) / 100; // convert knot speed to km/h
	}
	
	return data;
}

$(document).ready(function (){

	$('nav ul li a').live('click', function () {
		var url = $(this).attr('href');
		$.ajax(url).done(function (data) {
			//UBPE.lastDates = []; NE PAS REMETTRE A ZERO AU CHANGEMENT DE PAGE !!!
			UBPE._onPageUnload();
			$('#content_wrapper').css('height', $('#content').height());
			$('#content').fadeOut(function() {
				$('#content').html(data);
				$('#content').fadeIn(function() {
					$('#content_wrapper').css('height', $('#content').height());
				});
			});
		}).error(function() {
			alert("Page introuvable.");
		});
		return false;
	});

});
