var res = {
	list: 		[ 'water', 'game', 'power', 'waste', 'polythread', 'carbon', 'alloy', 'capacitor', 'panel' ],
	discovered:	[],
	flash: 		{ water: {}, game: {}, power: {}, waste: {}, polythread: {}, carbon: {}, alloy: {}, capacitor: {}, panel: {} },
	
	//natural 
	water:		0,
	game:		0,
	
	//artificial 
	power: 		0,
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
		cost:	0,
		life:	100,
		cool:	0,
		power:	0,
		unlock: [ 'dynamo' ], //, 'gather' ], 
		gain:	0,
		redo:	false,
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
	},
	
	instruments: {
		msg:	"check instruments",
		cost:	0, 
		life:	50,
		cool:	0,
		power:	0,						// should this cost power? probably 
		unlock: [ 'scout', ],
		gain:	0,
		redo:	false,
		start:	function () {
			document.getElementById('sidebar').style.visibility = "visible";
			
			toggleInstruments("lux");
			toggleInstruments("alti");
			toggleInstruments("azi");
		},
		fin:	0,
	},
	
	dynamo: {
		msg:	"pump dynamo",
		cost:	0,
		life:	0,
		cool:	0,
		power:	0,
		unlock:0,
		gain:	{ 'power': 1 },
		redo:	true,
		start:	0,
		fin:	0,
	},
	
	buildCap: {
		msg:	"wire capacitor bank",
		cost:	{ 'carbon': 10, 'alloy': 15 },
		life:	250,
		cool:	0,
		power:	0,
		unlock: 0,
		gain:	{ 'capacitor': 1 },
		redo:	true,
		start:	0,
		fin:	0,
	},
	
	repair: {
		msg:	"repair solar panel",
		cost:	0, //{ 'carbon': 10, 'alloy': 15 },
		life:	250,
		cool:	0,
		power:	0,
		unlock: 0,
		gain:	{ 'panel': 1 },
		redo:	false,
		start:	0,
		fin:	0,
	},
	
	gather: {
		msg:	"supply run",
		cost:	0,
		get life() { if (neededRes() == 0) return 0; else return 150; },
		get cool() { if (neededRes() == 0) return 0; else return 5000; },
		power:	0,
		unlock: 0,
		get gain() { return neededRes(); },
		redo:	true,
		start:	0,
		fin:	0,
	},
	
	scout: {
		msg:	"scout",
		cost:	0,
		life:	250,
		cool:	0,
		power:	0,
		unlock: 0,
		get gain() { 
			if (Math.random() > 0.9)
				addTask("repair");
			return { waste: Math.ceil(Math.random() * 7) };
		},
		redo:	true,
		start:	0,
		fin:	0,
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