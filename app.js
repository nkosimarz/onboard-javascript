var RECORD_COUNT = JSON.parse(getData("http://localhost:2050/recordCount")); // total number of records available in webserver
var LAST_ENTRY, CURRENT_ENTRY; // entry numbers required for prev and next funtionality
var resizeTimer; // delay required to reduce the number of calls made by browser when resizing the window
// makes api call and returns data
function getData(dataLink) {
    var apiCall = new XMLHttpRequest();
    apiCall.open("GET", dataLink, false); // false to prevent asych // warning need to change
    apiCall.send(null);
    return apiCall.responseText;
}
// converts strings into array and table
function parseText(textString) {
    var outputArray = textString.replace(/'/g, '""');
    outputArray = JSON.parse(textString);
    return outputArray;
}
var tableGenerator = /** @class */ (function () {
    function tableGenerator(element, firstRecord) {
        this.element = element;
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);
        // get table height based on  remaining window size after buttons
        var ctrlHeight = (document.getElementById('controls').offsetHeight);
        var contentHeight = (window.innerHeight - document.getElementById('controls').offsetHeight);
        this.myTable.setAttribute("height", "contentHeight");
        // calculate row number based on table header + row heights + borders in CSS and ensure its never less than 1
        var numRows = Math.floor((contentHeight - ctrlHeight - 26) / 46);
        numRows = numRows <= 0 ? 1 : numRows;
        // set number of records to get from server and ensure that the last record doesnt exceed the limit.
        var endRecord = (firstRecord + numRows - 1);
        endRecord = (endRecord >= RECORD_COUNT ? RECORD_COUNT - 1 : endRecord);
        // get data from server
        var columnsString = getData("http://localhost:2050/columns");
        var recordsText = getData("http://localhost:2050/records?from=" + firstRecord + "&to=" + endRecord);
        // parse text from api call into arrays
        var columnsArray = parseText(columnsString);
        var recordsTable = parseText(recordsText);
        // write html for table header
        for (var _i = 0, columnsArray_1 = columnsArray; _i < columnsArray_1.length; _i++) {
            var i = columnsArray_1[_i];
            var th = document.createElement('th');
            this.myTable.appendChild(th);
            th.appendChild(document.createTextNode(" " + i));
        }
        // write html for table
        for (var _a = 0, recordsTable_1 = recordsTable; _a < recordsTable_1.length; _a++) {
            var iEntry = recordsTable_1[_a];
            var tr = document.createElement('tr');
            this.myTable.appendChild(tr);
            for (var _b = 0, iEntry_1 = iEntry; _b < iEntry_1.length; _b++) {
                var jEntry = iEntry_1[_b];
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(" " + jEntry));
                tr.appendChild(td);
            }
        }
    }
    return tableGenerator;
}());
function createPage(firstRecord) {
    // ensure that the user input is a number and within range of available records
    if (firstRecord >= RECORD_COUNT || firstRecord < 0 || isNaN(firstRecord)) {
        alert('please select a NUMBER between 0 and ' + (RECORD_COUNT - 1));
        return;
    }
    var contentsDiv = document.getElementById('content');
    contentsDiv.innerHTML = ''; // empty table div to fill in a new table
    var tableElement = new tableGenerator(contentsDiv, parseInt(firstRecord)); // create table using the tableGenerator class
    // keep the ID of the first and last table entries to use for next and previous page buttons
    LAST_ENTRY = contentsDiv.lastChild.lastChild.firstChild.textContent;
    CURRENT_ENTRY = firstRecord;
}
;
// fucntion used by the next page buttton, requires the last entry from previously generated table
function nextPage() {
    createPage(parseInt(LAST_ENTRY) + 1);
}
// fucntion used by the previous page buttton, requires the first and last entry from previously generated table
function prevPage() {
    var newfirstEntry = CURRENT_ENTRY - (LAST_ENTRY - CURRENT_ENTRY) - 1;
    // if the new first entry is less than zero, take user to the first page 
    newfirstEntry <= 0 ? createPage(0) : createPage(newfirstEntry);
}
// hint for the user
function helpFunc() {
    alert('Table for viewing records with IDs 0 to '
        + (RECORD_COUNT - 1) + ' (Numbers Only)\nTo start from a specific record'
        + 'enter a record ID and click "Go To"');
}
window.onresize = function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doneResizing, 500);
    function doneResizing() {
        createPage(CURRENT_ENTRY);
    }
};
// load page for the first time and create buttons
window.onload = function () {
    createPage(0);
    var controlsDiv = document.getElementById('controls');
    // html for buttons and input text fields
    controlsDiv.innerHTML += '<button onclick = "createPage(0)">First Page</button>';
    controlsDiv.innerHTML += '<button onclick = "prevPage()" > Prev </button>';
    controlsDiv.innerHTML += '<button onclick = "nextPage()" > Next </button>';
    controlsDiv.innerHTML += '<button onclick = "createPage(document.getElementById(&quot;recordNum&quot;).value)"> Go To </button>';
    controlsDiv.innerHTML += '<input value = "record..." id = "recordNum" >';
    controlsDiv.innerHTML += '<button onclick="helpFunc()" > Help </button>';
    // let startButton = document.createElement('button');
    // startButton.appendChild(document.createTextNode('First Page'));
    // controlsDiv.appendChild(startButton);
    // startButton.setAttribute("onclick", "createPage(0)");
    // let prevButton = document.createElement('button');
    // prevButton.appendChild(document.createTextNode('Prev'));
    // controlsDiv.appendChild(prevButton);
    // prevButton.setAttribute("onclick", "prevPage()");
    // let nextButton = document.createElement('button');
    // nextButton.appendChild(document.createTextNode('Next'));
    // controlsDiv.appendChild(nextButton);
    // nextButton.setAttribute("onclick", "nextPage()");
    // let gotoButton = document.createElement('button');
    // gotoButton.appendChild(document.createTextNode('Go To'));
    // controlsDiv.appendChild(gotoButton);
    // gotoButton.setAttribute("onclick", 'createPage(document.getElementById("recordNum").value)');
    // let inputField = document.createElement('input');
    // controlsDiv.appendChild(inputField);
    // inputField.setAttribute("value", "record...");
    // inputField.setAttribute("id", "recordNum");
    // let helpButton = document.createElement('button');
    // helpButton.appendChild(document.createTextNode('Help'));
    // controlsDiv.appendChild(helpButton);
    // helpButton.setAttribute("onclick", "helpFunc()");
};
