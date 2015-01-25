var datasheet_element, hot_table,datasheet_container_element;

function initDatasheet() {
datasheet_container_element = document.getElementById('datasheet_container');
datasheet_element = document.getElementById('datasheet');
hot_table = new Handsontable(datasheet_element,{
  data: demoarray03,
  stretchH: 'all',
  colWidths: 30,
  rowHeaders: true,
  colHeaders: true,
  fixedColumnsLeft: 0,
  fixedRowsTop: 0,
  minSpareRows: 1,
  contextMenu: true,
  manualColumnResize: true,
  manualRowResize: true,
  minSpareRows: 1,
  persistentState: true
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
        for (var i = 0; i < instance.countRows(); i++) {
            var row = [];
            for (var h in headers) {
                var prop = instance.colToProp(h)
                var value = instance.getDataAtRowProp(i, prop)
                row.push(value)
            }
            
            csv += row.join(";")
            csv += "\n";
        }
        
        return csv;
    }