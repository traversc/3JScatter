var datasheet_element,hot_table,datasheet_container_element;

var table_data = [];
var page_number;
var pagelink_elements = [];

var footer_height = 400;

function customRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if(col === 0) {td.style.fontWeight = 'bold';}
  if(row === 0) {td.style.textDecoration = "underline";}
  td.style.textAlign = "center";
}

function initDataInput() {
	var table_data_replace = JSON.parse(localStorage.getItem(document.location.href + ".table_data"));
	table_data = table_data_replace == undefined ? [d3.csv.parseRows(demostring02)] : table_data_replace;
	page_number = 0;

	datasheet_container_element = $('#datasheet_container')[0];
	datasheet_element = $('#datasheet')[0];
	hot_table = new Handsontable(datasheet_element,{
		data: table_data[0],
		stretchH: 'all',
		/*colWidths: 80,*/
		rowHeaders: false,
		colHeaders: false,
		renderAllRows: true,
		maxRows: 2000,
		maxCols: 20,
		fixedColumnsLeft: 0,
		fixedRowsTop: 1,
		minSpareRows: 1,
		contextMenu: true,
		manualColumnResize: true,
		manualRowResize: false,
		persistentState: false,
		cells: function (row, col, prop) {
			var cellProperties = {};
			cellProperties.renderer = customRenderer;
			return cellProperties;
		}
	});
	
	$("#add_points").on('click', function(event) {
		table_data.push([["series","x","y","z","pch","color","outline_color","size","hist","hist_color","euler_x","euler_y","euler_z"],["point",,,,,,,,,,,,]]);
		page_number = table_data.length - 1;
		hot_table.loadData(table_data[page_number]);
		updatePagination();
	});
	
	$("#add_lines").on('click', function(event) {
		table_data.push([["series","x","y","z","pch","color","outline_color","size","hist","hist_color","euler_x","euler_y","euler_z","lty","line_size","line_color"],["line",,,,,,,,,,,,,,,]]);
		page_number = table_data.length - 1;
		hot_table.loadData(table_data[page_number]);
		updatePagination();
	});

	$("#add_spline").on('click', function(event) {
		table_data.push([["series","x","y","z","color","size","segments"],["spline",,,,,,]]);
		page_number = table_data.length - 1;
		hot_table.loadData(table_data[page_number]);
		updatePagination();
	});
	
	$("#add_text").on('click', function(event) {
		table_data.push([["series","x","y","z","text","color","size"],["text",,,,,,,]]);
		page_number = table_data.length - 1;
		hot_table.loadData(table_data[page_number]);
		updatePagination();
	});
	
	$("#add_lights").on('click', function(event) {
		table_data.push([["series","x","y","z","lit","color","brightness"],["light",,,,,,,]]);
		page_number = table_data.length - 1;
		hot_table.loadData(table_data[page_number]);
		updatePagination();
	});
	
	
	$("#delete_series").on('click', function(event) {
		if(table_data.length == 1) {
			table_data[0].splice(1, table_data[0].length-2);
			hot_table.loadData(table_data[0]);
		} else {
			table_data.splice(page_number,1);
			page_number = Math.max(0, page_number - 1);
			hot_table.loadData(table_data[page_number]);
		}
		updatePagination();
	});
	

	//Handsontable.Dom.addEvent(window, 'resize', calculateSize); //repalced with jquery
	$(window).on('resize',calculateSize);

	//dynamically set footer/plot area heights
	var footer = $("#footer");
	footer.css('height',footer_height + 'px');
	var fh = parseInt(footer.css('height'),10);
	var wh = $(window).height();
	var rt = wh - fh - 12;
	var ph = wh - fh - 15;
	$("#resize_handle").css('top',rt + 'px');
	$("#plotarea").css('height',ph + 'px');


	$("#resize_handle").on('mousedown', function(e) {
		$('*').css('cursor','row-resize');
		$(document).on('mousemove', function(e) {
			var footer = $('#footer');
			var plotarea = $('#plotarea');
			var resizer = $("#resize_handle");
			var wh = $(window).height();
			var min_top = 20;
			var max_top = wh - 6;
			var loc = Math.min(Math.max(e.clientY,min_top), max_top);
			resizer.css('top',loc + 'px');
			//the following is really slow in firefox for some reason
			if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {
				footer.css('height',wh - loc - 12 + 'px');
				plotarea.css('height',loc - 3 + 'px');
				calculateSize();
			}
		});
		$(document).on('mouseup', function stopDrag(e) {
			$('*').css('cursor','');
			$(document).off('mousemove');
			$(document).off('mouseup');
			var footer = $('#footer');
			var plotarea = $('#plotarea');
			var resizer = $("#resize_handle");
			var wh = $(window).height();
			var min_top = 20;
			var max_top = wh - 6;
			var loc = Math.min(Math.max(e.clientY,min_top), max_top);
			footer.css('height',wh - loc - 12 + 'px');
			plotarea.css('height',loc - 3 + 'px');
			resizer.css('top',loc + 'px');
			calculateSize();
		});
	});

	calculateSize();
	updatePagination();

}


//add pagelinks in an array, add or remove based on the size of table_data; also check if table_data.length > pagelink_array, and then append more
//to do: program buttons - add - add data series to end; remove - delete current data series, decrement page_number by 1, hot_table.loadData.  if only 1 page left, remove all series data

function updatePagination() {
	$('#pagination span').detach();
	for(var i=0; i < table_data.length; i++) {
		if(i >= pagelink_elements.length) {
			var p = i + 1;
			var pagelink = $("<span id='page"+p+"'"+">"+p+"</span>").on('click',{page: i}, function(event) {
				//event.preventDefault();
				page_number = event.data.page;
				hot_table.loadData(table_data[event.data.page]);
				for(var i=0; i < table_data.length; i++) {
					if(i == page_number) {
						pagelink_elements[i][0].className="selected";
					} else {
						pagelink_elements[i][0].className="";
					}
					$("#pagination").append(pagelink_elements[i]);
				}
				page_number = event.data.page;
			});
			pagelink_elements[i] = pagelink;
		}
	}
	for(var i=0; i < table_data.length; i++) {
		if(i == page_number) {
			pagelink_elements[i][0].className="selected";
		} else {
			pagelink_elements[i][0].className="";
		}
		$("#pagination").append(pagelink_elements[i]);
	}
}

function calculateSize() {
	var fh = parseInt($("#footer").css('height'),10);
	var wh = $(window).height();
	var rt = wh - fh - 12;
	var ph = wh - fh - 15;
	$("#resize_handle").css('top',rt + 'px');
	$("#plotarea").css('height',ph + 'px');
	if(RENDERER.domElement.id == "myRENDERER" & gui_vars.fix_width == 'auto') {
		PLOT_WIDTH = document.getElementById('plotarea').clientWidth;
		PLOT_HEIGHT = document.getElementById('plotarea').clientHeight;
		RENDERER.setSize(PLOT_WIDTH, PLOT_HEIGHT);
		if(CAMERA instanceof THREE.PerspectiveCamera) {
			CAMERA.aspect = PLOT_WIDTH / PLOT_HEIGHT;
			CAMERA.updateProjectionMatrix();
		} else { //Orthographic
			CAMERA.left = -PLOT_WIDTH/2;
			CAMERA.right = PLOT_WIDTH/2;
			CAMERA.top = PLOT_HEIGHT/2;
			CAMERA.bottom = -PLOT_HEIGHT/2;
			CAMERA.updateProjectionMatrix();
		}
	}
    //var offset = Handsontable.Dom.offset(datasheet_element);
    //availableWidth = Handsontable.Dom.innerWidth(footer) - offset.left + window.scrollX;
    //availableHeight = Handsontable.Dom.innerHeight(footer) - offset.top + window.scrollY;
    var availableWidth = Handsontable.Dom.innerWidth(datasheet_container_element);
    var availableHeight = Handsontable.Dom.innerHeight(datasheet_container_element);
    datasheet_element.style.width = availableWidth + 'px';
    datasheet_element.style.height = availableHeight + 'px';
}

function saveData() {
	localStorage.setItem(document.location.href + ".table_data", JSON.stringify(table_data));
}


function table2csv() {
	var csv = "";
	var csv_writer = new csvWriter();
	for(var p = 0; p < table_data.length; p++) {
		csv = csv + csv_writer.arrayToCSV(table_data[p]);
		csv = csv + "\n";
	}
	return csv;
}

function table2Objects() {
	function array2Object(arr) {
		var labels = arr[0];
		var rv = [];
		for (var i = 1; i < arr.length; ++i) {
			rv[i-1] = {};
			for(var j = 0; j < arr[0].length; j++) {
				rv[i-1][labels[j]] = arr[i][j];
			}
		}
		return rv;
	}
	rv = [];
	for (var i = 0; i < table_data.length; ++i) {
		rv[i] = array2Object(table_data[i]);
	}
	return rv;
}

/* http://stackoverflow.com/a/22184713/2723734 */
/**
 * Class for creating csv strings
 * Handles multiple data types
 * Objects are cast to Strings
 **/

function csvWriter(del, enc) {
	this.del = del || ','; // CSV Delimiter
	this.enc = enc || '"'; // CSV Enclosure
	
	// Convert Object to CSV column
	this.escapeCol = function (col) {
		if(isNaN(col)) {
			// is not boolean or numeric
			if (!col) {
				// is null or undefined
				col = '';
			} else {
				// is string or object
				col = String(col);
				if (col.length > 0) {
					// use regex to test for del, enc, \r or \n
					// if(new RegExp( '[' + this.del + this.enc + '\r\n]' ).test(col)) {
					
					// escape inline enclosure
					col = col.split( this.enc ).join( this.enc + this.enc );
				
					// wrap with enclosure
					col = this.enc + col + this.enc;
				}
			}
		}
		return col;
	};
	
	// Convert an Array of columns into an escaped CSV row
	this.arrayToRow = function (arr) {
		var arr2 = arr.slice(0);
		
		var i, ii = arr2.length;
		for(i = 0; i < ii; i++) {
			arr2[i] = this.escapeCol(arr2[i]);
		}
		return arr2.join(this.del);
	};
	
	// Convert a two-dimensional Array into an escaped multi-row CSV 
	this.arrayToCSV = function (arr) {
		var arr2 = arr.slice(0);
		
		var i, ii = arr2.length;
		for(i = 0; i < ii; i++) {
			arr2[i] = this.arrayToRow(arr2[i]);
		}
		return arr2.join("\r\n");
	};
}

function demo1() {
	gui_vars.cam_pos_x = 75;
	gui_vars.cam_pos_y = 120;
	gui_vars.cam_pos_z = 150;
	gui_vars.axes_origin = '-13.94088,18.45637,-48.347339899';
	gui_vars.axes_label_x = 'PC1';
	gui_vars.axes_label_y = 'PC2';
	gui_vars.axes_label_z = 'PC3';
	gui_vars.axes_font_size = 3;
	gui_vars.axes_limit_x = '-61.08749847,33.20573654';
	gui_vars.axes_limit_y = '-43.00385156,79.91658524';
	gui_vars.axes_limit_z = '-48.34733989,29.88257884';
	gui_vars.scale_x = 50;
	gui_vars.scale_y = 50;
	gui_vars.scale_z = 25;
	table_data = [d3.csv.parseRows(demostring01)];
	hot_table.loadData(table_data[0]);
	main();
}
function demo2() {
	gui_vars.cam_pos_x = 6.8111164727439535;
	gui_vars.cam_pos_y = -258.9940054581132;
	gui_vars.cam_pos_z = 41.374497176635742;
	gui_vars.axes_origin = '-1.2,-1.2,-1.2';
	gui_vars.axes_limit_x = '-2,2';
	gui_vars.axes_limit_y = '-2,2';
	gui_vars.axes_limit_z = '-2,2';
	gui_vars.plot_type = "Plane";
	table_data = [d3.csv.parseRows(demostring02)];
	hot_table.loadData(table_data[0]);
	main();
}
function demo3() {
	//$('#textinputarea').get(0).value = demostring03;
	hot_table.loadData(d3.csv.parseRows(demostring03));
	main();
}
