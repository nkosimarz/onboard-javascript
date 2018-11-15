class Greeter {
    element: HTMLElement;
    myTable: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement, firstRecord) {
        this.element = element;
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);

        // keep me, also rewrite
        // makes api call and returns data
        function getData(dataLink: string) {
            let apiCall = new XMLHttpRequest();
            apiCall.open("GET", dataLink, false); // false to prevent asych // warning need to change
            apiCall.send(null);
            return apiCall.responseText;
        }

        //keep me 
        // converts strings into array and table
        function parseText(textString) {
            // let outputArray = textString.replace(/'/g, '""');
            let outputArray = JSON.parse(textString);
            return outputArray;
        }

        // make calls and save the string data
        const recordCount = JSON.parse(getData("http://localhost:2050/recordCount"));
        let tableSize = 500;
        const columnsString = getData("http://localhost:2050/columns");
        let endRecord = 1*(firstRecord + tableSize);
        // document.getElementById('content2').innerHTML = " " + endRecord; // this breaks code
        let recordsText = getData("http://localhost:2050/records?from=" + firstRecord + "&to=" + tableSize);

        const columnsArray = parseText(columnsString);
        let recordsTable = parseText(recordsText);

        // this.myTable.innerHTML += columnsArray;
        // this.myTable.innerHTML += recordCount;

        for (const i of columnsArray) {
            let th = document.createElement('th');
            this.myTable.appendChild(th);

            th.appendChild(document.createTextNode(" " + i));
        }

        for (const iEntry of recordsTable) {

            let tr = document.createElement('tr');
            this.myTable.appendChild(tr);

            // this.myTable.insertBefore(tr, this.myTable.firstChild); // needed if i decide to use backward fill

            for (const jEntry of iEntry) {

                let td = document.createElement('td');
                td.appendChild(document.createTextNode(" " + jEntry));
                tr.appendChild(td);
            }

            // page is overfull stop filling and remove last child
            if (this.myTable.offsetHeight >= window.innerHeight) {
                this.myTable.removeChild(this.myTable.lastChild)
                break;
            }
        }
    }
}

let lastEntry;

function createPage(firstRecord) {

    let el = document.getElementById('content');
    el.innerHTML = '';
    let greeter = new Greeter(el, firstRecord);
    lastEntry = el.lastChild.lastChild.firstChild.textContent;
    // let el2 = document.getElementById('content2');
};

function nextPage() {
    createPage(parseInt(lastEntry));
}

window.onload = () => {
    document.documentElement.style.overflow = 'hidden';
    createPage(0);
}

// create buttons and text box here instead of html
// restructure functions and classes for better flow
// prev and last page button
// fill screen vs fill window
// add data from api at any time
// enter for text field
// comments
// fixed window percentage vs font size