// BG code here
increment = 1.0;
angle = 0;
tilt = 105;
r = 100;

northX = -Math.cos(toRad(tilt)) * r + 500;
northY = -Math.sin(toRad(tilt)) * r + 200;

southX = Math.cos(toRad(tilt)) * r + 500;
southY = Math.sin(toRad(tilt)) * r + 200;

function toRad(deg) {
	return (deg / 180) * Math.PI;
}

function wrapDegrees(deg) {
	while (deg < 0) 
		deg += 360;
	return deg % 360;
}

function writeArc(xRad, yRad, rotation, sweepFlag, endX, endY) {
	// radius 0 glitches arc rendering, so draw a line instead 
	if (Math.floor(xRad) == 0 || Math.floor(yRad) == 0 || 
		Math.ceil(xRad) == 0 || Math.ceil(yRad) == 0)
		return "L " + endX + ' ' + endY;
	else
		return "A " + xRad + ' ' + yRad + ' ' + rotation + " 0 " + sweepFlag + ' ' + endX + ' ' + endY;
}

function writeBand(id, leading, trailing, xray) {
	leading = wrapDegrees(leading);
	trailing = wrapDegrees(trailing);
	
	var leadRadius;
	if (!xray && (leading > 180)) // || leading < 0))	// deprecated by new wrapDegrees
		leadRadius = -r;
	else
		leadRadius = Math.cos(toRad(leading)) * r;
	
	var trailRadius;
	if (!xray && (trailing > 180)) // || trailing < 0))	// deprecated by new wrapDegrees
		trailRadius = -r;
	else
		trailRadius	= Math.cos(toRad(trailing)) * r;
	
	if (!xray) {
		if (trailing < 180 && leading > 180)
			leadRadius = r;
		if (leading > 180 && trailing < 180)
			leadRadius = r;
	}
	
	var path;
	if (!xray && (leading == 180 && trailing == 0))
		path = "";
	else {
		var leadSweep = 0;
		if (leadRadius > 0)
			leadSweep = 1;
		
		var trailSweep = 0;
		if (trailRadius < 0)
			trailSweep = 1;
		
		var move = "M " + northX + ' ' + northY;
		var leadArc = writeArc(leadRadius, r, tilt-90, leadSweep, southX, southY);
		var trailArc = writeArc(trailRadius, r, tilt-90, trailSweep, northX, northY);
		
		path = move + ' ' + leadArc + ' ' + trailArc;
	}
	
	document.getElementById(id).setAttribute('d', path);
}

function load() {
	minNavPane("cap");
	minNavPane("runner");
	minNavPane("bush");
	
	expoNext();
	
	cycle();
	
	setInterval(function() {
		//angle = noonline
		//var lead = wrapDegrees(angle+90);
		//var trail = wrapDegrees(angle-90);
		
		writeBand('dawn', angle+90, angle-90, false);
		//writeBand('day', angle+90, angle-90, false);
		//writeBand('dusk', angle-90, angle-96, false);
		//writeBand('arc', angle - 5, angle + 5, false);
		
		angle += increment;
		angle %= 360;
	}, 20);
}

// UI code here 
// star
altitude = -6;
increment = 0.1;
 
// surface
lux = 0;
 
var opening = {
	1: "thick fog obscuring the riverbank.",
	2: "reeds and cattails swaying in the mist.",
	3: "other, darker shapes shift just beyond your eyesight.",
	4: "water moves at a steady clip.",
	5: "unfocused. water flows together. edge sharpens.",
	6: "notice something that isn't there.",
	7: "ahead, rapids. aside, tracking.",
	8: "feel them looking. not at you, at the package.",
	9: "shadows roll off distant mountains.",
	10: "sucking mud and bottom feeders grab you.",
	11: "the package bobs in the water.",
	12: "first rays of light peek through.",
	13: "fog starts to clear. catch a glimpse of them looking back.",
	14: "warm sun touches your skin.",
	15: "better stop while there's daylight.",
	len: 15,
	count: 0,

	nextMsg: '<a onClick="expoNext();" class="clicker">keep going</a> | ',
	stopMsg: '<a onClick="expoStop();" class="clicker">stop here</a>'
};

function cycle() {
	setInterval(function() {
		// altitude
		altitude += increment;
		if (altitude >= 90)
			increment *= -1;
		if (altitude <= -90)
			increment *= -1;
		document.getElementById('altitude').innerHTML = Math.round(altitude);
	   
		// lux
		if (altitude > -10)
			lux = clamp(Math.pow(altitude + 10, 2), 0, 100000);
		else
			lux = 0;
		var roundedLux = roundToTenth(lux);
		document.getElementById('lux').innerHTML = roundedLux;
		if (roundedLux % 1 == 0)
			document.getElementById('lux').innerHTML += ".0";
	   
		// time of day
		tod = document.getElementById('tod');
		if (altitude > 0 && tod.innerHTML == "dawn.")
			tod.innerHTML = "day.";
		else if (altitude < 0 && tod.innerHTML == "day.")
			tod.innerHTML = "dusk.";
		else if (altitude < -6 && tod.innerHTML == "dusk.")
			tod.innerHTML = "night.";
		else if (altitude > -6 && tod.innerHTML == "night.")
			tod.innerHTML = "dawn.";
	}, 100);
}

function expoNext() {
	opening.count += Math.floor(Math.random() * 2) + 1;
	opening.count = Math.min(opening.count, opening.len);
	
	document.getElementById('expoMessage').innerHTML += "<br>" + opening[opening.count];
	if (opening.count == opening.len)
		document.getElementById('expoButtons').innerHTML = opening.stopMsg;
	else
		document.getElementById('expoButtons').innerHTML = opening.nextMsg + opening.stopMsg;
}

function expoStop() {
	document.getElementById('expoButtons').innerHTML = "";
	document.getElementById('expoMessage').innerHTML = "";
	
	maxNavPane("bush");
}

function buildRunner() {
	maxNavPane('runner');
	smallNavPane('bush');
}

function maxNavPane(pane) {
	document.getElementById(pane).style.width = "40%";
	document.getElementById(pane).style.display = "inline";
}

function smallNavPane(pane) {
	document.getElementById(pane).style.width = "20%";
	document.getElementById(pane).style.display = "inline";
}

function minNavPane(pane) {
	document.getElementById(pane).style.width = "0%";
	document.getElementById(pane).style.display = "none";
}

function fillBar(id) {
	if (test < 100)
		test += 1;
	document.getElementById(id).style.width = test + '%';
}

function roundToTenth(n){
	return Math.round(n * 10) / 10;
}

function clamp(v, min, max){
	return Math.min(Math.max(v, min), max);
}