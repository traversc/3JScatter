var datasheet_element,hot_table,datasheet_container_element;

function initDatasheet() {
datasheet_container_element = $('#datasheet_container')[0];
datasheet_element = $('#datasheet')[0];
hot_table = new Handsontable(datasheet_element,{
  data: d3.csv.parseRows(demostring02),
  stretchH: 'all',
  colWidths: 30,
  rowHeaders: true,
  colHeaders: true,
  renderAllRows: true,
  maxRows: 1000,
  maxCols: 20,
  fixedColumnsLeft: 0,
  fixedRowsTop: 0,
  minSpareRows: 1,
  contextMenu: true,
  manualColumnResize: true,
  manualRowResize: false,
  minSpareRows: 1,
  persistentState: false
});
calculateSize();
Handsontable.Dom.addEvent(window, 'resize', calculateSize);
}


//localStorage.clear();
function calculateSize() {
    //var offset = Handsontable.Dom.offset(datasheet_element);
    //availableWidth = Handsontable.Dom.innerWidth(footer) - offset.left + window.scrollX;
    //availableHeight = Handsontable.Dom.innerHeight(footer) - offset.top + window.scrollY;
    var availableWidth = Handsontable.Dom.innerWidth(datasheet_container_element);
    var availableHeight = Handsontable.Dom.innerHeight(datasheet_container_element);
    datasheet_element.style.width = availableWidth + 'px';
    datasheet_element.style.height = availableHeight + 'px';
}

function table2csv() {
	var csv = "";
	for (var i = 0; i < hot_table.countRows()-1; i++) {
		csv += hot_table.getDataAtRow(i).join(",");
		csv += "\n";
	}
	return csv;
}