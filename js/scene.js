var res = {
	list: [ 'beans', 'polyester', 'powder' ],
	discovered: [],
	flash: { },		// transparency of background warning color upon insufficient resources 
	
	//natural 
	beans:		0,
	
	//artificial
	polyester:	0,
	powder:		0,
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
	},
	
	'coffee': {
		msg:	"brew coffee",
		cost: { beans: 1 },
		life:	300,
		cool:	3000,
		power:	0,
		unlocks: 0,
		gain:	0,
		redo:	true,
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
	},
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
}