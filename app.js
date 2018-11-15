var Greeter = /** @class */ (function () {
    function Greeter(element, firstRecord) {
        this.element = element;
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);
        // keep me, also rewrite
        // makes api call and returns data
        function getData(dataLink) {
            var apiCall = new XMLHttpRequest();
            apiCall.open("GET", dataLink, false); // false to prevent asych // warning need to change
            apiCall.send(null);
            return apiCall.responseText;
        }
        //keep me 
        // converts strings into array and table
        function parseText(textString) {
            // let outputArray = textString.replace(/'/g, '""');
            var outputArray = JSON.parse(textString);
            return outputArray;
        }
        // make calls and save the string data
        var recordCount = JSON.parse(getData("http://localhost:2050/recordCount"));
        var tableSize = 500;
        var columnsString = getData("http://localhost:2050/columns");
        var endRecord = 1 * (firstRecord + tableSize);
        // document.getElementById('content2').innerHTML = " " + endRecord; // this breaks code
        var recordsText = getData("http://localhost:2050/records?from=" + firstRecord + "&to=" + tableSize);
        var columnsArray = parseText(columnsString);
        var recordsTable = parseText(recordsText);
        // this.myTable.innerHTML += columnsArray;
        // this.myTable.innerHTML += recordCount;
        for (var _i = 0, columnsArray_1 = columnsArray; _i < columnsArray_1.length; _i++) {
            var i = columnsArray_1[_i];
            var th = document.createElement('th');
            this.myTable.appendChild(th);
            th.appendChild(document.createTextNode(" " + i));
        }
        for (var _a = 0, recordsTable_1 = recordsTable; _a < recordsTable_1.length; _a++) {
            var iEntry = recordsTable_1[_a];
            var tr = document.createElement('tr');
            this.myTable.appendChild(tr);
            // this.myTable.insertBefore(tr, this.myTable.firstChild); // needed if i decide to use backward fill
            for (var _b = 0, iEntry_1 = iEntry; _b < iEntry_1.length; _b++) {
                var jEntry = iEntry_1[_b];
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(" " + jEntry));
                tr.appendChild(td);
            }
            // page is overfull stop filling and remove last child
            if (this.myTable.offsetHeight >= window.innerHeight) {
                this.myTable.removeChild(this.myTable.lastChild);
                break;
            }
        }
    }
    return Greeter;
}());
var lastEntry;
function createPage(firstRecord) {
    var el = document.getElementById('content');
    el.innerHTML = '';
    var greeter = new Greeter(el, firstRecord);
    lastEntry = el.lastChild.lastChild.firstChild.textContent;
    // let el2 = document.getElementById('content2');
}
;
function nextPage() {
    createPage(parseInt(lastEntry));
}
window.onload = function () {
    document.documentElement.style.overflow = 'hidden';
    createPage(0);
};
// create buttons and text box here instead of html
// restructure functions and classes for better flow
// prev and last page button
// fill screen vs fill window
// add data from api at any time
// enter for text field
// comments
// fixed window percentage vs font size
