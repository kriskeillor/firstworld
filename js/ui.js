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
}

function closeLog() {
	minNavPane("log");
	maxNavPane("ui");
}

function addTask(id) {
	js = 'onClick="startTask(\''+id+'\');"';
	bar = "<div id='bar" + id + "' class='bar'>"
	document.getElementById('ui').innerHTML += "<p>" + bar + "<a id='" + id + "'" + js + " class='clicker'>" + tasks[id].msg + "</div></p>";
}

function startTask(id) {
	if (tasks.active.indexOf(id) != -1)
		return;
	
	for (i = 0; i < res.list.length; i++) {
		var resName = res.list[i];
		
		if (tasks[id].cost[resName] > res[resName])
		{
			flashRes(resName);
			
			if (res.discovered.indexOf(resName) == -1)
				discoverRes(resName);
			return;
		}
	}
	
	tasks[id].timer = tasks[id].life;
	tasks.active.push(id);
}

function updateTasks() {
	finished = [];
	
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
	
	updateFlashes();
}

function finishTask(id) {
	for (i = 0; i < tasks[id].unlocks.length; i++) { 
		if (tasks.active.indexOf(tasks[id].unlocks[i]) == -1)
			addTask(tasks[id].unlocks[i]);
	}
	
	if (tasks[id].cool > 0) {
		if (!tasks[id].cooling) {
			tasks[id].cooling = true;
			tasks[id].timer = tasks[id].cool;
		}
		else {
			tasks[id].cooling = false;
			index = tasks.active.indexOf(id);
			tasks.active.splice(index, 1);
		}
		
		return;
	}
	else {
		document.getElementById("bar" + id).outerHTML = "";
		
		index = tasks.active.indexOf(id);
		tasks.active.splice(index, 1);
		delete tasks[id];	
	}
}

function discoverRes(resName) {
	var resCon = document.getElementById("resCon");
	if (resCon.innerHTML == "")
		smallNavPane("res");
	
	res.discovered.push(resName);
	resCon.innerHTML += "<tr class='resCounter' id='" + resName + "'><td>" + resName + "</td><td class='vital' id='" + resName + "Count'>" + 0 +"</td></tr>";
}

function flashRes(resName) {
	// dawn color = fcb54d
	// yourNumber.toString(16)
	
	res.flash[resName] = 1.0;
}

function spendRes(resName) {
	// decrement counter in res and html 
}

function updateFlashes() {
	var nodes = document.getElementsByClassName('resCounter');
	for (i = 0; i < nodes.length; i++) {
		var resName = nodes[i].id;
		var bg = "rgba(252, 181, 77, " + res.flash[resName] + ")";			//"#" + res.flash[resName].toString(16);
		console.log(bg);
		nodes[i].style.backgroundColor = bg;
		res.flash[resName] *= 0.9;
	}
}