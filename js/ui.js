function maxNavPane(pane) {
	document.getElementById(pane).style.width = "40%";
	document.getElementById(pane).style.display = "inline";
}

function smallNavPane(pane) {
	document.getElementById(pane).style.width = "20%";
	document.getElementById(pane).style.display = "inline";
}

function minNavPane(pane) {
	document.getElementById(pane).style.width = "0%";
	document.getElementById(pane).style.display = "none";
}

function openLog() {
	maxNavPane("log");
	smallNavPane("ui");
	minNavPane("res");
}

function closeLog() {
	minNavPane("log");
	maxNavPane("ui");
	smallNavPane("res");
}

function addTask(id) {
	if (tasks.available.indexOf(id) != -1)
		return;
	if (tasks[id] == undefined) {
		console.log("! task '" + id + "' is not defined");
		return;
	}
	tasks.available.push(id);
	
	var js = 'onClick="startTask(\''+id+'\');"';
	var bar = "<div id='bar" + id + "' class='bar'>"
	var html = bar + "<a id='" + id + "'" + js + " class='clicker unselectable'>";
	document.getElementById('ui').innerHTML += html + tasks[id].msg + "</div>";
	document.getElementById("bar" + id).style.width = "0%";
	document.getElementById("bar" + id).style.backgroundColor = "#454545";
	document.getElementById("bar" + id).style.marginBottom = "2px";
}

function startTask(id) {
	// this is spaghetti
	if (tasks[id].mode == "pump") // && tasks[id].cooling == false)
		tasks[id].timer += tasks[id].pump;
	
	if (tasks.active.indexOf(id) != -1)
		return;
	
	if (checkResCost(id))
		return;
	
	// spend resource cost
	for (let i = 0; i < res.list.length; i++) {
		var resName = res.list[i];
		var count = tasks[id].cost[resName];
		if (count > 0)
			spendRes(resName, tasks[id].cost[resName]);
	}
	
	// this is spaghetti 
	if (tasks[id].mode != "pump")
		tasks[id].timer = 0;
	tasks[id].cooling = false;
	tasks.active.push(id);
	console.log(id + " started");
	
	// unique functions 
	if (tasks[id].start != 0) {
		console.log("running " + id + " start func");
		tasks[id].start();
	}
}

function checkResCost(id) {
	var lackRes = false;
	for (let i = 0; i < res.list.length; i++) {
		var resName = res.list[i];
		
		if (tasks[id].cost[resName] > res[resName])
		{
			if (res.discovered.indexOf(resName) == -1)
				discoverRes(resName);
			
			lackRes = true;
			flashRes(resName, "lacking");
		}
	}
	return lackRes;
}

function updateTasks() {
	var active = tasks.active.slice(0);
	
	for (let i = 0; i < active.length; i++) {
		var id = active[i];
		
		tasks[id].timer += tasks[id].tick;
		tasks[id].timer *= tasks[id].decay;
		
		if (tasks[id].timer >= tasks[id].max) {
			tasks[id].timer = tasks[id].max;
			finishTask(id);
		}
		else if (tasks[id].timer <= 0) {
			tasks[id].timer = 0;
			endTask(id);
		}
		else {
			var per = (tasks[id].timer / tasks[id].max) * 100;
			document.getElementById("bar" + id).style.width = per + '%';
		}
	}
}

// Tasks are finished when their progress hits max
function finishTask(id) {
	//if (tasks[id].cooling)
	//	return;
	
	getResFromTask(id);
	getUnlocksFromTask(id);
	var barElem = document.getElementById("bar" + id);
	
	if (tasks[id].redo) {
		tasks[id].cooling = true;
		
		if (tasks[id].tick == -tasks[id].max) {
			tasks.active.splice(tasks.active.indexOf(id), 1);
			barElem.style.width = '0%';
		}
	}
	else {
		tasks.active.splice(tasks.active.indexOf(id), 1);
		tasks.available.splice(tasks.available.indexOf(id), 1);
		barElem.outerHTML = "";
	}
	
	if (tasks[id].cost.electricity > 0)
		spendRes("electricity", -tasks[id].cost.electricity);
	
	console.log(id + " finished");
	if (tasks[id].fin != 0) {
		console.log("running " + id + " fin func");
		tasks[id].fin();
	}
}

//	Tasks are ended when their progress drops to zero 
function endTask(id) {
	tasks.active.splice(tasks.active.indexOf(id), 1);
	document.getElementById("bar" + id).style.width = '0%';
	console.log(id + " ended");
	
	if (tasks[id].end != 0) {
		console.log("running " + id + " end func");
		tasks[id].end();
	}
}

function getResFromTask(id) {
	let gains = tasks[id].gain;		// reduce getter calculations 
	for (let i = 0; i < res.list.length; i++)
	{
		let resName = res.list[i];
		let count = gains[resName];
		if (count > 0) {
			gainRes(resName, count);
		}
	}
}

function getUnlocksFromTask(id) {
	for (let i = 0; i < tasks[id].unlock.length; i++)
		addTask(tasks[id].unlock[i]);
}

function gainRes(resName, count) {
	if (res.discovered.indexOf(resName) == -1) 
		discoverRes(resName);
	
	res[resName] += count;
	document.getElementById(resName + "Count").innerHTML = res[resName];
}

function discoverRes(resName) {
	if (res.discovered.indexOf(resName) != -1)
		return;
	
	if (res.discovered.length == 0)
		smallNavPane("res");
	
	res.discovered.push(resName);
	
	var resCon = document.getElementById("res");
	resCon.innerHTML += genResHtml(resName);
	
	flashRes(resName, "discovered");
}

function genResHtml(name) {
	var label = "<span class='resLabel'>" + name + "</span> <span class='unitLabel'>" + res.label[name] + "</span>";
	var counter = "<span class='resCounter' id='" + name + "Count'>" + res[name] + "</span>";
	return "<div id='" + name + "' class='res bar unselectable'>" + label + counter + "</div>";
}

function flashRes(resName, indicator) {	
	res.flash[resName].scale = 1.0;
	var toColor;
	
	if (indicator == "discovered")
		toColor = "rgba(152, 189, 172, ";
	else if (indicator == "lacking") 
		toColor = "rgba(252, 181, 77, ";
	else 
		toColor = "rgba(69, 69, 69, ";
	
	res.flash[resName].color = toColor;
}

function spendRes(resName, cost) {
	res[resName] -= cost;
	document.getElementById(resName + "Count").innerHTML = res[resName];
	
	// this is spaghetti 
	if (resName == "electricity")
		document.getElementById("electricityCount").innerHTML = res.electricity + "/" + power.max;
}

function updateFlashes() {
	var nodes = document.getElementsByClassName('res');
	for (let i = 0; i < nodes.length; i++) {
		var resName = nodes[i].id;
		nodes[i].style.backgroundColor = res.flash[resName].color + res.flash[resName].scale + ")";
		
		res.flash[resName].scale -= 0.04;
		res.flash[resName].scale *= 0.96;
	}
}