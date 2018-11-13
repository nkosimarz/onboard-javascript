var Greeter = /** @class */ (function () {
    function Greeter(element) {
        this.element = element;
        // this.element.innerHTML += "The time is: ";
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);
        // this.myTable.innerText = new Date().toUTCString();
        // keep me, also rewrite
        // makes api call and returns data
        function httpGet(theUrl) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }
        //keep me 
        // converts strings into array and table
        function parseText(textString) {
            // let outputArray = textString.replace(/'/g, '""');
            var outputArray = JSON.parse(textString);
            return outputArray;
        }
        // make calls and save the string data
        var recordCount = httpGet("http://localhost:2050/recordCount");
        var table_size = 50;
        var columnsString = httpGet("http://localhost:2050/columns");
        var recordsText = httpGet("http://localhost:2050/records?from=0&to=" + table_size);
        var columnsArray = parseText(columnsString);
        var recordsTable = parseText(recordsText);
        // this.myTable.innerHTML += recordCount;
        // this.myTable.innerHTML += columnsArray;
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
            for (var _b = 0, iEntry_1 = iEntry; _b < iEntry_1.length; _b++) {
                var jEntry = iEntry_1[_b];
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(" " + jEntry));
                tr.appendChild(td);
            }
        }
    }
    Greeter.prototype.start = function () {
        // this.timerToken = setInterval(() => this.myTable.innerHTML = new Date().toUTCString(), 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
}());
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    document.documentElement.style.overflow = 'hidden';
    // document.getElementById('MEH').innerHTML = "5";
};
// pages
// scroll bar
// borders
// width
