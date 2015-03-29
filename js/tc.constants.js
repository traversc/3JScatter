//constants
var default_size = 1;
var default_pch = 1;
var default_color = 0x0000ff;
var default_outline_color = 0x0000ff;
var default_hist = 0;
var default_hist_color = 0x0000ff;
var default_lty = 0;
var default_line_size = 0.1;
var default_line_color = 0x0000ff;
var default_segments = 1000;


//global scope variables
var RENDERER = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer: true, alpha: true, precision: "highp"});
var CAMERA_FACERS = [];
var FIXED_Z_CAMERA_FACERS = [];
var PLOT_WIDTH,PLOT_HEIGHT;
var SCENE,CAMERA,CONTROLS;
var XLIM,YLIM,ZLIM;
var ao_rescaled_x,ao_rescaled_y,ao_rescaled_z;