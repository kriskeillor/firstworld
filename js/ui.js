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
		
		// dawn/dusk bands are 6 deg long, but have +1 deg on either end to help aliasing 
		writeBand('dawn', p.angle+97, p.angle+89, false);
		writeBand('day', p.angle+90, p.angle-90, false);
		writeBand('dusk', p.angle-89, p.angle-97, false);
		writeBand('night', p.angle-96, p.angle+96, false);
		
		//	!! 
		p.angle += increment;
		p.angle %= 360;
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