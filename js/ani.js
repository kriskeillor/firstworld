//	p for planet 
var p = {
	r:		100,		// planet radius, in pixels 
	tilt:	105,		// pole tilt, counterclowckwise from x-axis 
	angle:	-83,		// relative to star, in degrees 
	lux:	0,
	angVel:	0,
	
	origin:	{
		x:	300, 
		y:	450,
	},
};

//	s for system (will have more properties later)
var s = {
	altitude:	90,
}

//	initialize pole positions, as we can't reference r/tilt in the p initializer 
p.north = {
	x:	-Math.cos(toRad(p.tilt)) * p.r + p.origin.x,
	y:	-Math.sin(toRad(p.tilt)) * p.r + p.origin.y,
}
p.south = {
	x:	Math.cos(toRad(p.tilt)) * p.r + p.origin.x,
	y:	Math.sin(toRad(p.tilt)) * p.r + p.origin.y,
}

var colors = {
	dark:	"#090719",
	blue:	"#114488",
}

//	called by engine.js to run animations 
function animate() {
	writeBand('dawn', p.angle+97, p.angle+89, false);
	writeBand('day', p.angle+90, p.angle-90, false);
	writeBand('dusk', p.angle-89, p.angle-97, false);
	writeBand('night', p.angle-96, p.angle+96, false);
}

function writeArc(xRad, yRad, rotation, sweepFlag, endX, endY) {
	// radius 0 glitches arc rendering, so draw a line instead 
	if (Math.floor(xRad) == 0 || Math.floor(yRad) == 0 || 
		Math.ceil(xRad) == 0 || Math.ceil(yRad) == 0)
		return "L " + endX + ' ' + endY;
	else
		return "A " + xRad + ' ' + yRad + ' ' + rotation + " 0 " + sweepFlag + ' ' + endX + ' ' + endY;
}

//	note: will not work for arclengths > 180deg
//	(requires drawing 4 arc segments - may implement later, probably not )
function writeBand(id, leading, trailing, xray) {
	leading = wrapDegrees(leading);
	trailing = wrapDegrees(trailing);
	arclength = wrapDegrees(leading - trailing);
	
	var leadRadius, trailRadius;
	if (leading > 180 && trailing <= 180)
	{
		leadRadius = -p.r;
		trailRadius = Math.cos(toRad(trailing)) * p.r;
	}
	else if (leading < 180 && trailing >= 180)
	{
		leadRadius = Math.cos(toRad(leading)) * p.r;
		trailRadius = p.r;
	}
	else
	{
		leadRadius = Math.cos(toRad(leading)) * p.r;
		trailRadius = Math.cos(toRad(trailing)) * p.r;
	}
	
	var path;
	if (!xray && (leading > 180 && trailing > 180))
		path = "";
	else {
		var leadSweep = 0;
		if (leadRadius > 0)
			leadSweep = 1;
		
		var trailSweep = 0;
		if (trailRadius < 0)
			trailSweep = 1;
		
		var move = "M " + p.north.x + ' ' + p.north.y;
		var leadArc = writeArc(leadRadius, p.r, p.tilt-90, leadSweep, p.south.x, p.south.y);
		var trailArc = writeArc(trailRadius, p.r, p.tilt-90, trailSweep, p.north.x, p.north.y);
		
		path = move + ' ' + leadArc + ' ' + trailArc;
	}
	
	document.getElementById(id).setAttribute('d', path);
}