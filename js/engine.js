//	initialize scene and update loop 
function load() {
	initScene();
	
	setInterval(function() {
		moveSystem();
		writeSurface();
		updateTasks();
	}, 20);
}

// update positions of celestial objects 
function moveSystem() {
	p.angle += p.angVel;
	p.angle %= 360;
	
	// dawn/dusk bands are 6 deg long, but have +1 deg on either end to help aliasing 
	writeBand('dawn', p.angle+97, p.angle+89, false);
	writeBand('day', p.angle+90, p.angle-90, false);
	writeBand('dusk', p.angle-89, p.angle-97, false);
	writeBand('night', p.angle-96, p.angle+96, false);
}

//	update surface conditions and write to UI 
function writeSurface() {
	// s.altitude
	if (p.angle <= 90)
		s.altitude = p.angle;
	else if (p.angle <= 270)
		s.altitude = 180 - p.angle;
	else 
		s.altitude = 360 - p.angle;
	
	document.getElementById('altitude').innerHTML = Math.round(s.altitude);
	
	// lux
	if (s.altitude > -10)
		p.lux = clamp(Math.pow(s.altitude + 10, 2), 0, 100000);
	else
		p.lux = 0;
	var roundedLux = roundToTenth(p.lux);
	document.getElementById('lux').innerHTML = roundedLux;
	if (roundedLux % 1 == 0)
		document.getElementById('lux').innerHTML += ".0";
   
	// time of day
	/*tod = document.getElementById('tod');
	if (s.altitude > 0 && tod.innerHTML == "dawn.")
		tod.innerHTML = "day.";
	else if (s.altitude < 0 && tod.innerHTML == "day.")
		tod.innerHTML = "dusk.";
	else if (s.altitude < -6 && tod.innerHTML == "dusk.")
		tod.innerHTML = "night.";
	else if (s.altitude > -6 && tod.innerHTML == "night.")
		tod.innerHTML = "dawn.";*/
}
