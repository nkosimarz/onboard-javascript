class Greeter {
    element: HTMLElement;
    myTable: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        // this.element.innerHTML += "The time is: ";
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);
        // this.myTable.innerText = new Date().toUTCString();

        //keep me 
        // makes api call and returns data
        function httpGet(theUrl) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }

        //keep me 
        // converts strings into array and table
        function parseText(textString) {
            // let outputArray = textString.replace(/'/g, '""');
            let outputArray = JSON.parse(textString);

            return outputArray;
        }

        // make calls and save the string data
        const recordCount = httpGet("http://localhost:2050/recordCount");
        let table_size = 40;
        const columnsString = httpGet("http://localhost:2050/columns");
        let recordsText = httpGet("http://localhost:2050/records?from=0&to=" + table_size);

        const columnsArray = parseText(columnsString);
        let recordsTable = parseText(recordsText);

        // this.myTable.innerHTML += recordCount;
        // this.myTable.innerHTML += columnsArray;

        for (const iEntry of recordsTable) {

            let tr = document.createElement('tr');
            this.myTable.appendChild(tr);

            for (const jEntry of iEntry) {

                let td = document.createElement('td');
                td.appendChild(document.createTextNode(" " + jEntry));
                tr.appendChild(td);
            }
        }
    }


    start() {
        // this.timerToken = setInterval(() => this.myTable.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    // document.getElementById('MEH').innerHTML = "5";
};
