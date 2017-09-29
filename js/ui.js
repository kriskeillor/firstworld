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

function toggleInstruments(instrument) {
	var cost = display[instrument + "Cost"];
	
	if (display[instrument] == true) {
		display[instrument] = false;
		power.used -= cost;
		document.getElementById(instrument).style.visibility = "collapse";
		document.getElementById(instrument + "Unit").style.visibility = "collapse";
	}
	else if (power.max - power.used >= cost) {
		power.used += cost;
		document.getElementById(instrument).style.visibility = "visible";
		document.getElementById(instrument + "Unit").style.visibility = "visible";
	}
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
	tasks.available.push(id);
	
	var js = 'onClick="startTask(\''+id+'\');"';
	var bar = "<div id='bar" + id + "' class='bar'>"
	var html = bar + "<a id='" + id + "'" + js + " class='clicker'>";
	document.getElementById('ui').innerHTML += html + tasks[id].msg + "</div>";
	document.getElementById("bar" + id).style.width = "0%";
	document.getElementById("bar" + id).style.backgroundColor = "#454545";
}

function startTask(id) {
	if (tasks.active.indexOf(id) != -1)
		return;
	
	var lackRes = false;
	
	for (i = 0; i < res.list.length; i++) {
		var resName = res.list[i];
		
		if (tasks[id].cost[resName] > res[resName])
		{
			if (res.discovered.indexOf(resName) == -1)
				discoverRes(resName);
			
			lackRes = true;
			flashRes(resName, "lacking");
		}
	}
	
	if (lackRes)
		return;
	
	if (tasks[id].start != 0) {
		console.log('start task ' + id);
		tasks[id].start();
	}
	
	for (i = 0; i < res.list.length; i++) {
		var resName = res.list[i];
		var count = tasks[id].cost[resName];
		if (count > 0)
			spendRes(resName, tasks[id].cost[resName]);
	}
	
	tasks[id].timer = tasks[id].life;
	tasks.active.push(id);
}

function updateTasks() {
	var finished = [];
	
	for (i = 0; i < tasks.active.length; i++) {
		var id = tasks.active[i];
		tasks[id].timer -= 1;
		
		if (tasks[id].timer <= 0)
			finished.push(id);
		
		// animation 
		var per;
		if (!tasks[id].cooling)
			per = 100 - (tasks[id].timer / tasks[id].life) * 100;
		else
			per = (tasks[id].timer / tasks[id].cool) * 100;
		document.getElementById("bar" + id).style.width = per + '%';
	}
	
	for (i = 0; i < finished.length; i++) {
		finishTask(finished[i]);
	}
}

function finishTask(id) {
	// Resource gathering and finishing cooldowns  
	if (tasks[id].cooling) {
		tasks[id].cooling = false;
		tasks.active.splice(tasks.active.indexOf(id), 1);
		return;
	}
	else {
		getResFromTask(id);
		
		if (tasks[id].fin != 0) {
			console.log('finish task ' + id);
			tasks[id].fin();
		}
		
		for (i = 0; i < tasks[id].unlock.length; i++) {
			var toAdd = tasks[id].unlock[i];
			addTask(toAdd);
		}
	}
	
	// Starting cooldowns or removing tasks 
	if (tasks[id].redo) {
		if (tasks[id].cool > 0) {
			tasks[id].cooling = true;
			tasks[id].timer = tasks[id].cool;
		}
		else {
			tasks.active.splice(tasks.active.indexOf(id), 1);
			document.getElementById("bar" + id).style.width = '0%';
		}
	}
	else {
		tasks.active.splice(tasks.active.indexOf(id), 1);
		tasks.available.splice(tasks.available.indexOf(id), 1);
		document.getElementById("bar" + id).outerHTML = "";
	}
}

function getResFromTask(id) {
	for (i = 0; i < res.list.length; i++)
	{
		var resName = res.list[i];
		var count = tasks[id].gain[resName];
		if (count > 0) {
			gainRes(resName, count);
		}
	}
}

function gainRes(resName, count) {
	if (res.discovered.indexOf(resName) == -1) {
		discoverRes(resName);
		flashRes(resName, "discovered");
	}
	
	if (resName == 'power' && res.power >= res.capacitor * 10) {
		discoverRes('capacitor');
		flashRes('capacitor', "lacking");
		if (document.getElementById('sidebar').style.visibility != "visible")
			addTask("instruments");
		return;
	}
	
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
	
	var label = "<span class='resLabel'>" + resName + "</span>";
	var counter = "<span class='resCounter' id='" + resName + "Count'>" + res[resName] + "</span>";
	resCon.innerHTML += "<div id='" + resName + "' class='res bar'>" + label + counter + "</div>";
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
}

function updateFlashes() {
	var nodes = document.getElementsByClassName('res');
	for (i = 0; i < nodes.length; i++) {
		var resName = nodes[i].id;
		nodes[i].style.backgroundColor = res.flash[resName].color + res.flash[resName].scale + ")";
		
		res.flash[resName].scale -= 0.04;
		res.flash[resName].scale *= 0.96;
	}
}

function updateRes() {
	//...
}