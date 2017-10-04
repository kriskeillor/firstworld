var res = {
	list: 		[ 'water', 'game', 'power', 'waste', 'polythread', 'carbon', 'alloy', 'capacitor', 'panel' ],
	discovered:	[],
	flash: 		{ water: {}, game: {}, power: {}, waste: {}, polythread: {}, carbon: {}, alloy: {}, capacitor: {}, panel: {} },
	
	//natural 
	water:		0,
	game:		0,
	get power() { return power.available; },
	
	//artificial 
	waste:		0,
	polythread: 0,
	carbon:		0,
	alloy:		0,
	
	//structures 
	capacitor:	1,
	panel:		0,
	grinder:	0,
};

var power = {
	max:		0,
	used:		0,
	get available() { return this.max - this.used; },
	
	dynActive:	false,
	caps:		0, // stores the amount of capacitors used /when the dynamo is brought online/ (i.e. lags behind res cap count)
	
	dynOnline:	function() {
		this.dynActive = true;
		this.caps = res.capacitor; 
		this.max += Math.pow(10, this.caps);
		
		discoverRes("power");
		flashRes("power", "discovered");
		document.getElementById("powerCount").innerHTML = this.available + "/" + this.max;
	},
	
	dynOffline:	function() {
		if (this.dynActive == false)
			return;
		
		this.dynActive = false;
		this.max -= Math.pow(10, this.caps);
		
		if (this.used > this.max) {
			this.depower();
			flashRes("power", "lacking");
		}
		
		document.getElementById("powerCount").innerHTML = this.available + "/" + this.max;
	},
	
	depower: function() {
		console.log("EMERGENCY. FLUSH EVERYTHING");
	}
}

var display = {
	lux:		true,
	alti:		true,
	azi:		true,
	
	luxCost:	2,
	altiCost:	8,
	aziCost:	4,
};

var tasks = {
	available: [],
	active: [],
	
	wake: {
		msg:	"open window",
		power:	0,
		cost:	0,
		
		timer:	0,
		max:	100,
		
		tick:	1,
		decay:	1,
		
		redo:	false,
		unlock: [ 'dynamo' ], 
		gain:	0,
		
		start:	function() {
			p.angVel = 0.04;
			var lerpVal = 0;
			var max = 100; // (i.e. task's lifespan)
			setInterval( function() {
				if (lerpVal < max)
				{
					lerpVal++;
					var fadeColor = lerpColor(colors.dark, colors.blue, lerpVal / max);
					var bg = "-webkit-linear-gradient(top, " + colors.dark + ", " + fadeColor + ")";
					document.getElementsByTagName("body")[0].style.background = bg;
					document.getElementById("blurFe").setAttribute('stdDeviation', 3.0 * (lerpVal / max));
					
					p.angle = -86 + 90 * smoothStep(0, 1, lerpVal / max);
				}
			}, 20);
		},
		fin:	0,
		end:	0,
	},
	
	instruments: {
		msg:	"check instruments",
		power:	0,						// should this cost power? probably 
		cost:	0,
		
		timer:	0,
		max:	50,
		
		tick:	1,
		decay:	1,
		
		redo:	false,
		unlock: [ 'scout', ],
		gain:	0,
		start:	function () {
			document.getElementById('sidebar').style.visibility = "visible";
			
			toggleInstruments("lux");
			toggleInstruments("alti");
			toggleInstruments("azi");
		},
		fin:	0,
		end:	0,
	},
	
	dynamo: {
		mode:	"pump",
		msg:	"pump dynamo",
		power:	0,
		cost:	0,
		
		timer:	0,
		max:	500,
		
		get tick() { if (this.cooling) return -0.1; else return -0.5; },
		pump:	55,
		get decay() { if (this.cooling) return 1.0; else return 0.995; },
		cooling: false,
		
		redo:	true,
		unlock: [ "instruments" ],
		gain:	0,
		
		start:	0,
		fin:	function() { power.dynOnline(); },
		end:	function() { power.dynOffline(); }, 
	},
	
	buildCap: {
		msg:	"wire capacitor bank",
		power:	0,
		cost:	{ 'carbon': 10, 'alloy': 15 },
		
		timer:	0,
		max:	250,
		
		tick:	1,
		decay:	1,
		
		redo:	true,
		unlock: 0,
		gain:	{ 'capacitor': 1 },
		
		start:	0,
		fin:	0,
		end:	0,
	},
	
	repair: {
		msg:	"repair solar panel",
		power:	0,
		cost:	0,
		
		timer:	0,
		max:	250,
		
		tick:	1,
		decay:	1,
		
		redo:	false,
		unlock: 0,
		gain:	{ 'panel': 1 },
		
		start:	0,
		fin:	0,
		end:	0,
	},
	
	scout: {
		msg:	"scout",
		power:	0,
		cost:	0,
		
		timer:	0,
		max:	250,
		
		get tick() { if (this.cooling) return -this.max; else return 1; },
		decay:	1,
		
		redo:	true,
		unlock: 0,
		get gain() { 
			if (Math.random() > 0.9)
				addTask("repair");
			return { waste: Math.ceil(Math.random() * 7) };
		},
		
		start:	0,
		fin:	0,
		end:	0,
	},
};

function initScene() {
	minNavPane("log");
	maxNavPane("ui");
	minNavPane('res');
	
	addTask('wake');
}

function neededRes() {
	if (state.foundRes == false)
		return 0;
	
	var toGive = { };
	
	for (var i = 0; i < tasks.available.length; i++)
	{
		if (tasks.available[i].cost != 0) {
			toGive['beans'] = 1;
		}
	}
	
	return toGive;
}