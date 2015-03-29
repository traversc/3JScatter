gui_vars = {} //global

function loadDefaultSettings() {
	//
	//gui_vars.light_enabled = true;
	//gui_vars.shadows_enabled = false;
	gui_vars.axes_origin = 'auto';

	gui_vars.axes_label_x = 'x';
	gui_vars.axes_label_y = 'y';
	gui_vars.axes_label_z = 'z';

	gui_vars.axes_limit_x = 'auto';
	gui_vars.axes_limit_y = 'auto';
	gui_vars.axes_limit_z = 'auto';
	
	gui_vars.plot_type = "Standard";

	gui_vars.axes_font_size = 8;
	gui_vars.fix_width = 'auto';
	gui_vars.fix_height = 'auto';
	gui_vars.bgcolor = '0xffffff';

	gui_vars.cam_type = "Perspective";
	gui_vars.cam_pos_x = 100;
	gui_vars.cam_pos_y = 100;
	gui_vars.cam_zoom = 1;
	gui_vars.cam_pos_z = 100;

	gui_vars.scale_x = 50;
	gui_vars.scale_y = 50;
	gui_vars.scale_z = 30;

	gui_vars.scale_x = 50;
	gui_vars.scale_y = 50;
	gui_vars.scale_z = 50;

	gui_vars.tick_coord_x = 'off';
	gui_vars.tick_coord_y = 'off';
	gui_vars.tick_coord_z = 'off';
	gui_vars.tick_font_size = 4;
}


			
function reset() { //reload webpage, is there a better way? maybe clear all window objects and re-init?
	location.reload();
}
function exportpng() {
	window.open(renderer.domElement.toDataURL('image/png'),'screenshot');
}	

function initControlGui() {

	//replace hide function with empty function.  There is no way to remove an anonymous function event, nor a built in option to disable.  Silly dat.gui
	dat.GUI.toggleHide = function () {};
	
	gui = new dat.GUI({width: 220});
	loadGuiState();
	$('#gui_sidebar')[0].appendChild(gui.domElement);
	$('.dg.main.a')[0].style.marginTop = '80px';
	$('.dg.main.a').children()[0].style.display = 'none'; //resize button - no ID or class, should probably check CSS attributes in case it is no longer the first element
	$('.close-button')[0].style.display = 'none'; //close control button

	//gui.remember(gui_vars); super wonky save behavior, don't use
	//localStorage.setItem(document.location.href + '.isLocal','true'); //default save to local storage automatically
	//append event to existing http://stackoverflow.com/questions/5183529/jquery-append-an-event-handler-to-preexisting-click-event
	
	savebar = document.createElement("div");
	savebar.className = 'save-row';
	$('#plotarea').prepend(savebar);
	
	//.onChange(function(newValue) {saveGuiState();});
	//gui.add(this, 'init').name('Plot Data');
	//gui.add(this, 'reset').name('Reset');
	//gui.add(this, 'exportpng').name('Export as PNG');
	//gui.add(this, 'clearSettings').name('Clear Settings');
	gui.add(gui_vars, 'bgcolor').name('Bckgrnd Color');
	gui.add(gui_vars, 'plot_type', ['Standard','Box','Plane']).name('Plot Type');
	//gui.add(gui_vars, 'light_enabled').name('Add Light');
	//gui.add(gui_vars, 'shadows_enabled').name('Add Shadows');
	axes_folder = gui.addFolder('Axes Controls');
		axes_origin_control = axes_folder.add(gui_vars, 'axes_origin').name('Origin (x,y,z)');
		axes_limits_folder = axes_folder.addFolder('Axes Limits');
			axes_limits_folder.add(gui_vars, 'axes_limit_x').name('X (x1,x2)');
			axes_limits_folder.add(gui_vars, 'axes_limit_y').name('Y (y1,y2)');
			axes_limits_folder.add(gui_vars, 'axes_limit_z').name('Z (z1,z2)');
		axes_label_folder = axes_folder.addFolder('Axes Labels');
			axes_label_folder.add(gui_vars, 'axes_label_x').name('X label');
			axes_label_folder.add(gui_vars, 'axes_label_y').name('Y label');
			axes_label_folder.add(gui_vars, 'axes_label_z').name('Z label');
			axes_label_folder.add(gui_vars, 'axes_font_size').name('Font Size');
		axes_tick_marks_folder = axes_folder.addFolder('Axes Tick Marks');
			axes_tick_marks_folder.add(gui_vars, 'tick_coord_x').name('X coords');
			axes_tick_marks_folder.add(gui_vars, 'tick_coord_y').name('Y coords');
			axes_tick_marks_folder.add(gui_vars, 'tick_coord_z').name('Z coords');
			axes_tick_marks_folder.add(gui_vars, 'tick_font_size').name('Font Size');
	plot_size_folder = gui.addFolder('Plot Dimensions');
		plot_size_folder.add(gui_vars, 'fix_height').name('Height (px)');
		plot_size_folder.add(gui_vars, 'fix_width').name('Width (px)');
	plot_scale_folder = gui.addFolder('Plot Scale Factors');
		plot_scale_folder.add(gui_vars, 'scale_x').min(10).max(100).name('X scale');
		plot_scale_folder.add(gui_vars, 'scale_y').min(10).max(100).name('Y scale');
		plot_scale_folder.add(gui_vars, 'scale_z').min(10).max(100).name('Z scale');
	camera_loc_folder = gui.addFolder('Camera');
		camera_loc_folder.add(gui_vars, 'cam_type', ['Perspective','Orthographic']).name('Cam. Type');
		camera_loc_folder.add(gui_vars, 'cam_pos_x').name('Camera X');
		camera_loc_folder.add(gui_vars, 'cam_pos_x').name('Camera Y');
		camera_loc_folder.add(gui_vars, 'cam_pos_x').name('Camera Z');
		camera_loc_folder.add(gui_vars, 'cam_zoom').name('Cam. Zoom');
		
	loadFoldersState();
}



function saveGuiState() {
	localStorage.setItem(document.location.href + ".gui_vars", JSON.stringify(gui_vars));
	
	var gui_folder_vars = {};
	var gui_folder_keys = Object.keys(gui.__folders);
	for (var i = 0; i < gui_folder_keys.length; i++) {
		gui_folder_vars[gui_folder_keys[i]] = gui.__folders[gui_folder_keys[i]].closed;
	}
	localStorage.setItem(document.location.href + ".gui_folder_vars",JSON.stringify(gui_folder_vars));
	
	var gui_axis_folder_vars = {};
	var gui_axis_folder_keys = Object.keys(gui.__folders["Axes Controls"].__folders);
	for (var i = 0; i < gui_axis_folder_keys.length; i++) {
		gui_axis_folder_vars[gui_axis_folder_keys[i]] = gui.__folders["Axes Controls"].__folders[gui_axis_folder_keys[i]].closed;
	}
	localStorage.setItem(document.location.href + ".gui_axis_folder_vars",JSON.stringify(gui_axis_folder_vars));
}

function loadGuiState() {
	loadDefaultSettings();
	var gui_vars_replace = JSON.parse(localStorage.getItem(document.location.href + ".gui_vars"));
	if(gui_vars_replace != undefined) {
		var gui_vars_keys = Object.keys(gui_vars);
		for (var i = 0; i < gui_vars_keys.length; i++) {
			var gv = gui_vars_replace[gui_vars_keys[i]];
			if(gv != undefined) {
				gui_vars[gui_vars_keys[i]] = gv;
			}
		}
	}
	updateDisplay(gui);
}


//rewrite later to be more general
function loadFoldersState() {	
	var gui_folder_vars_replace = JSON.parse(localStorage.getItem(document.location.href + ".gui_folder_vars"));
	if(gui_folder_vars_replace != undefined) {
		var gui_folder_keys = Object.keys(gui.__folders);
		for (var i = 0; i < gui_folder_keys.length; i++) {
			var folder_closed = gui_folder_vars_replace[gui_folder_keys[i]];
			if(folder_closed == true) {
				gui.__folders[gui_folder_keys[i]].close();
			} else {
				gui.__folders[gui_folder_keys[i]].open();
			}
		}
	} else {
		axes_folder.open();
		plot_size_folder.open();
		plot_scale_folder.open();
		camera_loc_folder.open();
	}
	var gui_axis_folder_vars_replace = JSON.parse(localStorage.getItem(document.location.href + ".gui_axis_folder_vars"));
	if(gui_axis_folder_vars_replace != undefined) {
		var gui_axis_folder_keys = Object.keys(gui.__folders["Axes Controls"].__folders);
		for (var i = 0; i < gui_axis_folder_keys.length; i++) {
			var folder_closed = gui_axis_folder_vars_replace[gui_axis_folder_keys[i]];
			if(folder_closed == true) {
				gui.__folders["Axes Controls"].__folders[gui_axis_folder_keys[i]].close();
			} else {
				gui.__folders["Axes Controls"].__folders[gui_axis_folder_keys[i]].open();
			}
		}
	} else {
		axes_label_folder.open();
		axes_limits_folder.open();
		axes_tick_marks_folder.open();
	}
}

function clearGuiState() {
	//localStorage.getItem(document.location.href + ".gui_axis_folder_vars");
	//localStorage.getItem(document.location.href + ".gui_folder_vars");
	//localStorage.getItem(document.location.href + ".gui_vars");	
	axes_folder.open();
	axes_label_folder.open();
	axes_limits_folder.open();
	axes_tick_marks_folder.open();
	plot_size_folder.open();
	plot_scale_folder.open();
	camera_loc_folder.open();
	loadDefaultSettings();
	updateDisplay(gui);
}

function updateDisplay(gui) {
	for (var i in gui.__controllers) {
		gui.__controllers[i].updateDisplay();
	}
	for (var f in gui.__folders) {
		updateDisplay(gui.__folders[f]);
	}
}

//old, new use JSON
/*
function saveGuiState() {
	var gui_keys = Object.keys(gui_vars);
	for (var i = 0; i < gui_keys.length; i++) {
		localStorage.setItem(document.location.href + "." + gui_keys[i],gui_vars[gui_keys[i]]);
	}
	var gui_folder_keys = Object.keys(gui.__folders);
	for (var i = 0; i < gui_folder_keys.length; i++) {
		localStorage.setItem(document.location.href + ".folders." + gui_folder_keys[i],gui.__folders[gui_folder_keys[i]].closed);
	}
}


//firefox/chrome can only store strings in localstorage 2-7-15
function loadGuiState() {
	//folders
	var gui_folder_keys = Object.keys(gui.__folders);
	for (var i = 0; i < gui_folder_keys.length; i++) {
		var folder_closed = localStorage.getItem(document.location.href + ".folders." + gui_folder_keys[i]);
		if(folder_closed === null || folder_closed == "false" || folder_closed == false) {
			gui.__folders[gui_folder_keys[i]].open();
		} else {
			gui.__folders[gui_folder_keys[i]].close();
		}
	}
	//variables
	var gui_keys = Object.keys(gui_vars);
	for (var i = 0; i < gui_keys.length; i++) {
		var gvar = localStorage.getItem(document.location.href + "." + gui_keys[i]);
		if(gvar === null) continue;
		var gtype = typeof gui_vars[gui_keys[i]];
		switch(gtype) {
			case "string":
				gui_vars[gui_keys[i]] = gvar;
				break;
			case "number":
				gui_vars[gui_keys[i]] = parseFloat(gvar);
				break;
			case "boolean":
				gui_vars[gui_keys[i]] = gvar == "true" || gvar == true ? true : false;
				break;
		}
	}
}
*/








