$( document ).ready(function() {
	//constants
	default_size = 1;
	default_pch = 1;
	default_color = 0x0000ff;
	default_outline_color = 0x0000ff;
	default_hist = 0;
	default_hist_color = 0x0000ff;
	default_lty = 0;
	default_line_size = 0.1;
	default_line_color = 0x0000ff;
	default_segments = 1000;


	//global scope variables
	RENDERER = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer: true, alpha: true, precision: "highp"});
	CAMERA_FACERS = [];
	FIXED_Z_CAMERA_FACERS = [];
	PLOT_WIDTH = undefined;
	PLOT_HEIGHT = undefined;
	SCENE = undefined;
	CAMERA = undefined;
	CONTROLS = undefined;
	XLIM = undefined;
	YLIM = undefined;
	ZLIM = undefined;
	ao_rescaled_x = undefined;
	ao_rescaled_y = undefined;
	ao_rescaled_z = undefined;
})