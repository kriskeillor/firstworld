var res = {
	list: [ 'beans', 'water', 'game', 'polythread', 'carbon fiber', 'alloy powder', 'solar cell' ],
	discovered: [],
	flash: { },		// transparency of background warning color upon insufficient resources 
	
	//natural 
	beans:		0,
	water:		0,
	game:		0,
	
	//artificial
	polythread: 0,
	'carbon fiber': 0,
	'alloy powder': 0,
	
	// structures 
	'solar cell':		0,
};

var tasks = {
	active: [],
	
	'window': {
		// animate: fade-in background gradient and planet 
		msg:	"open window",
		cost:	0,
		life:	25,
		cool:	0,
		power:	0,
		unlocks: [ 'coffee', 'instruments' ],
		gain:	0,
		redo:	false,
		fin:	0,
	},
	
	'instruments': {
		msg:	"check instruments",
		cost:	0, 
		life:	150,
		cool:	0,
		power:	0,						// should this cost power? probably 
		unlocks: 0,
		gain:	0,
		redo:	false,
		fin:	0,
	},
	
	'coffee': {
		msg:	"brew coffee",
		cost: { beans: 1, },
		life:	300,
		cool:	3000,
		power:	0,
		unlocks: 0,
		gain:	0,
		redo:	true,
		fin:	0,
	},
	
	'gather': {
		msg:	"gather supplies",
		cost:	0,
		life:	150,					// should be a function depending on needed resources 
		cool:	5000,					// should also be a function 
		power:	0,
		unlocks: 0,
		gain: { beans: 1 },
		redo:	true,
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
		fin:	0,
	}
};

var state = {
	foundResources:	false,
	foundLogs:		false,	// actually, the logs button can just be appended whenever the first is found, so this isn't needed 
}

function initScene() {
	minNavPane("log");
	maxNavPane("ui");
	minNavPane('res');
	
	addTask('window');
	
	//addTask('gather');
	//addTask('coffee');
	//addTask('repair');
}