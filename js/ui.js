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

function fillBar(barId) {
	//if (test < 100)
	//	test += 1;
	//document.getElementById("bar" + id).style.width = test + '%';
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
	tasks[id].life = tasks[id].time;
	tasks.active.push(id);
}

function updateTasks() {
	finished = [];
	
	for (i = 0; i < tasks.active.length; i++) {
		id = tasks.active[i];
		tasks[id].life -= 1;
		console.log("task " + id + " has life " + tasks[id].life);
		if (tasks[id].life <= 0) 
			finished.push(id);
		per = tasks[id].life / tasks[id].time;
		console.log("width of " + id + " is " + per + "%");
		document.getElementById("bar" + id).style.width = (100 - per * 100) + '%';
	}
	
	for (i = 0; i < finished.length; i++) {
		finishTask(finished[i]);
	}
}

function finishTask(id) {
	document.getElementById("bar" + id).outerHTML = "";
	
	for (i = 0; i < tasks[id].unlocks.length; i++) { 
		addTask(tasks[id].unlocks[i]);
	}
	
	index = tasks.active.indexOf(id);
	tasks.active.splice(index, 1);
	delete tasks[id];
}