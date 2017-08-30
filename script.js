// star
altitude = 0;
increment = 0.1;

// surface
lux = 0;

function cycle(){
	setInterval(function() {
		// move star 
		altitude += increment;
		if (altitude >= 90)
			increment *= -1;
		if (altitude <= -90)
			increment *= -1;
		document.getElementById('altitude').innerHTML = Math.round(altitude);
		
		// set lux
		if (altitude > -10)
			lux = clamp(Math.pow(altitude + 10, 2), 0, 100000);
		else
			lux = 0;
		document.getElementById('lux').innerHTML = roundToTenth(lux);
		
		// set time of day 
		//if (altitude > 0)
		//	document.getElementById('surface').innerHTML = "Daytime";
		//else if (altitude >= -6)
		//	document.getElementById('surface').innerHTML = "Twilight";
		//else 
		//	document.getElementById('surface').innerHTML = "Night";
	}, 100);
}

function roundToTenth(n){
	return Math.round(n * 10) / 10;
}

function clamp(v, min, max){
	return Math.min(Math.max(v, min), max);
}