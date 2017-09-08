function load() {
	minNavPane("log");
	smallNavPane("p1");
	minNavPane("p2");
	
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