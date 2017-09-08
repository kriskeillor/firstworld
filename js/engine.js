// UI code here 
// star
altitude = -6;
increment = 1;

// surface
lux = 0;

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