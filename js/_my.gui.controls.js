//no var declaration to ensure in global scope

gui_vars = {}
gui_vars.first_time = true;
gui_vars.light_enabled = true;
gui_vars.shadows_enabled = false;
gui_vars.fix_plot_dimensions = false;
gui_vars.fix_axes_loc = false;
gui_vars.axes_origin = 'auto';
gui_vars.axes_label_x = 'x';
gui_vars.axes_label_y = 'y';
gui_vars.axes_label_z = 'z';
gui_vars.axes_limit_x = 'auto';
gui_vars.axes_limit_y = 'auto';
gui_vars.axes_limit_z = 'auto';
gui_vars.axes_font_size = 8;
gui_vars.fix_width = 'auto';
gui_vars.fix_height = 'auto';
gui_vars.bgcolor = '0xffffff';
gui_vars.cam_pos_x = 100;
gui_vars.cam_pos_y = 100;
gui_vars.cam_pos_z = 100;
gui_vars.scale_x = 50;
gui_vars.scale_y = 50;
gui_vars.scale_z = 30;

			
function reset() { //reload webpage, is there a better way? maybe clear all window objects and re-init?
	location.reload();
}
//dat.gui variables
function exportpng() {
	window.open(renderer.domElement.toDataURL('image/png'),'screenshot');
}	
function freeze() {
	controls_enabled = !controls_enabled;
	if(controls_enabled && typeof renderer != 'undefined') {
		animate();
	}
}
function clearSettings() {
	localStorage.clear();
	location.reload();
}

//names of all variables to save to local storage, this isn't needed
//gui_control_names = ["light_enabled","shadows_enabled","fix_plot_dimensions","fix_axes_loc","axes_origin","axes_label_x",,"axes_limit_x","axes_limit_y","axes_limit_z","axes_label_y","axes_label_z","axes_font_size","gui_state","axes_folder_state","axes_label_folder_state","plotsize_folder_state"]; //currently incomplete

function initControlGui() {
	gui = new dat.GUI({width: 220});
	$('#guiContainer')[0].appendChild(gui.domElement);
	$('.dg.main.a')[0].style.marginTop = '75px';
	$('.dg.main.a').children()[0].style.display = 'none'; //resize button - no ID or class, should probably check CSS attributes in case it is no longer the first element
	$('.close-button')[0].style.display = 'none'; //close control button

	//gui.remember(gui_vars); super wonky save behavior, don't use
	//localStorage.setItem(document.location.href + '.isLocal','true'); //default save to local storage automatically
	//append event to existing http://stackoverflow.com/questions/5183529/jquery-append-an-event-handler-to-preexisting-click-event
	
	savebar = document.createElement("div");
	savebar.className = 'save-row';
	$('#plotarea').prepend(savebar);
	
	//to do in future: resize element dynamically
	//http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
	//
	gui.add(this, 'freeze').name('Freeze/Unfreeze');
	gui.add(this, 'exportpng').name('Export as PNG');
	gui.add(this, 'reset').name('Reset Plot');
	gui.add(this, 'clearSettings').name('Clear Settings');
	gui.add(gui_vars, 'light_enabled').name('Add Light');
	gui.add(gui_vars, 'shadows_enabled').name('Enable Shadows');
	gui.add(gui_vars, 'bgcolor').name('Background Color');
	//.onChange(function(newValue) {saveGuiState();});
	//axes controls
	axes_folder = gui.addFolder('Axes Controls');
		axes_origin_control = axes_folder.add(gui_vars, 'axes_origin').name('Origin Location (x,y,z)');
		axes_label_folder = axes_folder.addFolder('Axes Labels');
			axes_label_folder.add(gui_vars, 'axes_label_x').name('X axis label');
			axes_label_folder.add(gui_vars, 'axes_label_y').name('Y axis label');
			axes_label_folder.add(gui_vars, 'axes_label_z').name('Z axis label');
			axes_label_folder.add(gui_vars, 'axes_font_size').name('Axes Font Size');
		axes_limits_folder = axes_folder.addFolder('Axes Limits');
			axes_limits_folder.add(gui_vars, 'axes_limit_x').name('X axis limits (x1,x2)');
			axes_limits_folder.add(gui_vars, 'axes_limit_y').name('Y axis limits (y1,y2)');
			axes_limits_folder.add(gui_vars, 'axes_limit_z').name('Z axis limits (z1,z2)');
	
	//plot size controls
	plot_size_folder = gui.addFolder('Plot Dimensions');
		//plotsize_folder.add(gui_vars, 'fix_plot_dimensions').name('Fix Plot Size');
		plot_size_folder.add(gui_vars, 'fix_height').name('Plot Height (px)');
		plot_size_folder.add(gui_vars, 'fix_width').name('Plot Width (px)');
		plot_scale_folder = gui.addFolder('Plot Scale Factors');
		plot_scale_folder.add(gui_vars, 'scale_x').name('X dimension scale').min(10).max(100);
		plot_scale_folder.add(gui_vars, 'scale_y').name('Y dimension scale').min(10).max(100);
		plot_scale_folder.add(gui_vars, 'scale_z').name('Z dimension scale').min(10).max(100);
		camera_loc_folder = gui.addFolder('Camera Location');
		camera_loc_folder.add(gui_vars, 'cam_pos_x').name('Camera X position');
		camera_loc_folder.add(gui_vars, 'cam_pos_x').name('Camera Y position');
		camera_loc_folder.add(gui_vars, 'cam_pos_x').name('Camera Z position');
	
	//temp - open folders
	for(var f in gui.__folders) {
		console.log(f);
		gui.__folders[f].open();
	}

}

function saveGuiState() {
	//Object.keys(gui.__folders)
	//for (var i = 0; i < gui_control_names.length; i ++) {
	//	localStorage.setItem(document.location.href + "." + gui_control_names[i],window[gui_control_names[i]]);
	//gui.__folders['Axes Controls'].closed
	//}
}




