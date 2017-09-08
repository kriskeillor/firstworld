function toRad(deg) {
	return (deg / 180) * Math.PI;
}

function wrapDegrees(deg) {
	while (deg < 0) 
		deg += 360;
	return deg % 360;
}

function roundToTenth(n){
	return Math.round(n * 10) / 10;
}

function clamp(v, min, max){
	return Math.min(Math.max(v, min), max);
}