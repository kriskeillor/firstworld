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
	document.getElementById('ui').innerHTML += "<p><a id='" + id + "'" + js + " class='clicker'>" + tasks[id].msg + "</p>";
}

function startTask(id) {	
	document.getElementById(id).outerHTML = "";
	
	for (i = 0; i < tasks[id].unlocks.length; i++) { 
		addTask(tasks[id].unlocks[i]);
	}
	
	/*tasks[id].unlocks.forEach(function(e) {
		addTask(e);
	});*/

	delete tasks[id];
}