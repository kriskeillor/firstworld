//	initialize scene and update loop 
function load() {
	initScene();
	
	setInterval(function() {
		moveSystem();
		writeSurface();
		power.checkSolar();
		updateTasks();
		updateFlashes();
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
		s.altitude = p.angle - 360;
	
	document.getElementById('altiCount').innerHTML = Math.round(s.altitude);
	document.getElementById('aziCount').innerHTML = Math.round(wrapDegrees(p.angle) + 180);
	
	// lux
	if (s.altitude > -10)
		p.lux = clamp(Math.pow(s.altitude + 10, 2), 0, 100000);
	else
		p.lux = 0;
	var roundedLux = roundToTenth(p.lux);
	document.getElementById('luxCount').innerHTML = roundedLux;
	if (roundedLux % 1 == 0)
		document.getElementById('luxCount').innerHTML += ".0";
}
