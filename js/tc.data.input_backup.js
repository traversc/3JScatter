var datasheet_element,hot_table,datasheet_container_element;

var table_data = [];
var page_number;
var pagelink_elements = [];



function customRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if(col === 0) {td.style.fontWeight = 'bold';}
  if(row === 0) {td.style.textDecoration = "underline";}
  td.style.textAlign = "center";
}

function initDatasheet() {
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
		table_data.push([["series","x","y","z","pch","color","outline_color","size","hist","hist_color","euler_x","euler_y","euler_z"],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,],[,,,,,,,,,,,,]]);
		page_number = table_data.length - 1;
		hot_table.loadData(table_data[page_number]);
		updatePagination();
	});
	
	$("#add_lines").on('click', function(event) {
		table_data.push([["series","x","y","z","pch","color","outline_color","size","hist","hist_color","euler_x","euler_y","euler_z","lty","line_size","line_color"],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,],[,,,,,,,,,,,,,,,]]);
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
	

	calculateSize();
	Handsontable.Dom.addEvent(window, 'resize', calculateSize); //can replace with jquery?
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