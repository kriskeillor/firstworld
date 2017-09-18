var res = {
	list: [ 'beans', 'water', 'game', 'waste', 'polythread', 'carbon fiber', 'alloy powder', 'solar cell' ],
	discovered: [],
	flash: { },		// transparency of background warning color upon insufficient resources 
	
	//natural 
	beans:		0,
	water:		0,
	game:		0,
	
	//artificial
	waste:		0,
	polythread: 0,
	'carbon fiber': 0,
	'alloy powder': 0,
	
	// structures 
	'solar cell':		0,
};

var tasks = {
	available: [],
	active: [],
	
	'window': {
		msg:	"open window",
		cost:	0,
		life:	100,
		cool:	0,
		power:	0,
		unlocks: [ 'coffee', 'gather' ], 
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
	
	'instruments': {
		msg:	"check instruments",
		cost:	0, 
		life:	50,
		cool:	0,
		power:	0,						// should this cost power? probably 
		unlocks: [ 'scout', 'repair' ],
		gain:	0,
		redo:	false,
		start:	function () {
			document.getElementById('sidebar').style.visibility = "visible";
		},
		fin:	0,
	},
	
	'coffee': {
		msg:	"brew coffee",
		cost: { beans: 1, },
		life:	300,
		cool:	3000,
		power:	0,
		unlocks: [ 'scout' ],
		gain:	0,
		redo:	true,
		start:	0,
		fin:	0,
	},
	
	'gather': {
		msg:	"supply run",
		cost:	0,
		get life() { if (neededRes() == 0) return 0; else return 150; },
		get cool() { if (neededRes() == 0) return 0; else return 5000; },
		power:	0,
		unlocks: 0,
		get gain() { return neededRes(); },
		redo:	true,
		start:	0,
		fin:	0,
	},
	
	'scout': {
		msg:	"scout",
		cost:	0,
		life:	250,
		cool:	0,
		power:	0,
		unlocks: 0,
		get gain() { return { waste: Math.ceil(Math.random() * 7) }; },
		redo:	true,
		start:	0,
		fin:	0,
	},
	
	'repair': {
		msg:	"repair solar cell",
		cost: 	0,
		get life() { return Math.pow(res['solar cell'] + 9, 2); },
		cool:	1, 
		power:	0,
		unlocks: 0,
		gain:	{ 'solar cell': 1 },
		redo:	true,
		start:	0,
		fin:	0,
	}
};

var state = {
	foundRes:	false,
	foundLogs:	false,	// actually, the logs button can just be appended whenever the first is found, so this isn't needed 
}

function initScene() {
	minNavPane("log");
	maxNavPane("ui");
	minNavPane('res');
	
	addTask('window');
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