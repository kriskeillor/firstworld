var res = {
	list: 		[ 'water', 'meals', 'rations', 'power', 'waste', 'polythread', 'crystal', 'metal', 'capacitor', 'panel', 'grinder', 'dynamo' ],
	discovered:	[],
	flash: 		{ water: {}, meals: {}, rations: {}, power: {}, waste: {}, polythread: {}, crystal: {}, metal: {}, capacitor: {}, panel: {}, grinder: {}, dynamo: {} },
	
	get power() { return power.available; },
	set power(n){ power.available = n; },
	
	//natural
	water:		0,
	meals:		0,
	rations:	0,
	
	//artificial
	waste:		0,
	polythread: 0,
	crystal:	0,
	metal:		0,
	
	//structures
	dynamo:		1,
	capacitor:	1,
	panel:		0,
	grinder:	0,
};

var power = {
	max:		0,
	available:	0,
	
	dynActive:	false,
	caps:		0, // stores the amount of capacitors used /when the dynamo is brought online/ (i.e. lags behind res cap count)
	
	prevSolar:	0,
	
	dynOnline:	function() {
		if (this.dynActive)
			return;
		
		this.dynActive = true;
		
		this.max += res.capacitor * 10;
		this.available += this.max;
		this.caps = res.capacitor; 
		
		discoverRes("power");
		document.getElementById("powerCount").innerHTML = this.available + "/" + this.max;
	},
	
	dynOffline:	function() {
		if (this.dynActive == false)
			return;
		
		this.dynActive = false;
		let lostPower = this.caps * 10;
		this.max -= lostPower;
		this.available -= lostPower;
		
		if (this.available < 0)
			this.depower();
		
		document.getElementById("powerCount").innerHTML = this.available + "/" + this.max;
	},
	
	checkSolar: function() {
		if (res.panel == 0)
			return;
		
		this.available -= this.prevSolar;
		let newSolar = Math.floor(p.lux * 0.005 * res.panel);
		this.available += newSolar;
		this.prevSolar = newSolar;
		
		document.getElementById("powerCount").innerHTML = this.available + "/" + this.max;
	},
	
	depower: function() {
		this.available = this.max;
		flashRes("power", "lacking");
		
		for (let i = 0; i < tasks.active.length; i++) {
			let id = tasks.active[i];
			if (tasks[id].cost.power > 0) 
				endTask(id);
		}
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
		cost:	0,
		
		timer:	0,
		max:	100,
		
		tick:	1,
		decay:	1,
		
		redo:	false,
		unlock: [ 'supply', 'dynamo' ], 
		gain:	0,
		
		start:	function() {
			p.angVel = 0.05;
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
		cost:	{ 'power': 3 },
		
		timer:	0,
		max:	50,
		
		tick:	1,
		decay:	1,
		
		redo:	false,
		unlock: [ 'scout', 'buildCap' ],
		gain:	0,
		start:	function () {
			document.getElementById('sidebar').style.visibility = "visible";
			
			toggleInstruments("lux");
			toggleInstruments("alti");
			toggleInstruments("azi");
		},
		fin:	function() { delete tasks.instruments; },
		end:	0,
	},
	
	dynamo: {
		mode:	"pump",
		msg:	"pump dynamo",
		cost:	0,
		
		timer:	0,
		max:	500,
		
		get tick() { if (this.cooling) return -0.1; else return -0.5; },
		pump:	55,
		get decay() { if (this.cooling) return 1.0; else return 0.9975; },
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
		cost:	{ 'crystal': 10, 'metal': 15 },
		
		timer:	0,
		max:	250,
		
		get tick() { if (this.cooling) return -this.max; else return 1; },
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
		cost:	{ 'power': 2 },
		
		timer:	0,
		max:	200,
		
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
		cost:	0,
		
		timer:	0,
		max:	200,
		
		get tick() { if (this.cooling) return -this.max; else return 1; },
		decay:	1,
		
		redo:	true,
		unlock: 0,
		get gain() { 
			if (Math.random() > 0.9)
				addTask("repair");
			return { crystal: Math.ceil(Math.random() * 10) + 2, metal: Math.ceil(Math.random() * 10) + 2 };
		},
		
		start:	0,
		fin:	0,
		end:	0,
	},
	
	supply: {
		msg:	"make supply run",
		cost:	0,
		
		timer:	0,
		max:	500,
		//get max() { return this.gain * 10 + 10; },
		
		get tick() { if (this.cooling) return -1; else return 1; },
		decay:	1,
		
		redo:	true,
		unlock:	0,
		get gain() {
			let gains = {};
			for (let i = 0; i < tasks.available.length; i++) {
				id = tasks.available[i];
				if (tasks.active.indexOf(id) == -1) {
					let allCosts = tasks[id].cost;
					for (let n = 0; n < res.discovered.length; n++) {
						let thisCost = allCosts[res.discovered[n]];
						if (thisCost != undefined && thisCost > res[res.discovered[n]]) {
							let diff = thisCost - res[res.discovered[n]];
							if (gains[res.discovered[n]] == undefined || gains[res.discovered[n]] < diff) 
								gains[res.discovered[n]] = diff;
						}
					}
				}
			}
			return gains;
		},
		
		start:	0,
		fin:	0,
		end:	0,
	}
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