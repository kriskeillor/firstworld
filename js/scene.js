var res = {
	canvas:	0,
	panels:	0,
	keys:	0,
};

var tasks = {
	'castOff': {
		msg:	"cast off",
		cost:	0,
		time:	250,
		power:	0,
		unlocks: [ 'rollOut', 'openPanels' ],
		gain: {
			canvas:	3,
		}
	},
	
	'takeBag': {
		msg:	"take bag",
		cost: 	0, 
		time: 	150, 
		power:	0,
		unlocks:0,
		gain: { 
			canvas:	1,
			keys:	1, 
		}
	},
	
	'rollOut': {
		msg:	"roll out",
		cost:	0, 
		time:	500, 
		power:	0,
		unlocks: [ 'kickstart' ]
	},
	
	'openPanels': {
		msg:	"open panels",
		cost:	0,
		time:	250,
		power:	0,
		unlocks: 0,
		gain: {
			panels:	1,
		}
	},
	
	'kickstart': {
		msg:	"kickstart",
		cost: {
			keys:	1,
		},
		time:	75,
		power:	1,
		unlocks: [ 'wheelsUp' ],
	},
	
	'wheelsUp': {
		msg:	"end demo",
	}
};

function initScene() {
	minNavPane("log");
	maxNavPane("ui");
	
	addTask('castOff');
	addTask('takeBag');
}