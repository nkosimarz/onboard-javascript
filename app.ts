// makes api call and returns data
function getData(dataLink: string) {
    let apiCall = new XMLHttpRequest();
    apiCall.open("GET", dataLink, false); // false to prevent asych // warning need to change
    apiCall.send(null);
    return apiCall.responseText;
}

// converts strings into array and table
function parseText(textString) {
    let outputArray = textString.replace(/'/g, '""');
    outputArray = JSON.parse(textString);
    return outputArray;
}

const recordCount = JSON.parse(getData("http://localhost:2050/recordCount"));

class Greeter {
    element: HTMLElement;
    myTable: HTMLElement;

    constructor(element: HTMLElement, firstRecord) {
        this.element = element;
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);

        // make calls and save the string data


        let tableSize = 100;
        const columnsString = getData("http://localhost:2050/columns");
        let endRecord = (firstRecord + tableSize);
        endRecord = (endRecord >=recordCount ? recordCount-1 : endRecord);
        let recordsText = getData("http://localhost:2050/records?from=" + firstRecord + "&to=" + endRecord);
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
            if (this.myTable.offsetHeight > 0.95 * (window.innerHeight)) {
                this.myTable.removeChild(this.myTable.lastChild)
                break;
            }
        }
    }
}

let lastEntry;

function createPage(firstRecord) {

    // alert(parseInt(firstRecord));
    if (firstRecord >= recordCount || firstRecord < 0) {
        alert('please select a NUMBER between 0 and ' + recordCount);
        return;
    }

    let el = document.getElementById('content');
    el.innerHTML = '';
    let greeter = new Greeter(el, parseInt(firstRecord)); // set number is slower
    lastEntry = el.lastChild.lastChild.firstChild.textContent;
};

function nextPage() {
    createPage(lastEntry);
}

window.onload = () => {

    createPage(0);
    document.documentElement.style.overflow = 'hidden';
    let startButton = document.createElement('button');
    startButton.appendChild(document.createTextNode('Start Page'));
    document.getElementById('controls').appendChild(startButton);
    startButton.setAttribute("onclick", "createPage(0)");

    let nextButton = document.createElement('button');
    nextButton.appendChild(document.createTextNode('Next Page'));
    document.getElementById('controls').appendChild(nextButton);
    nextButton.setAttribute("onclick", "nextPage()");

    let gotoButton = document.createElement('button');
    gotoButton.appendChild(document.createTextNode('Go To'));
    document.getElementById('controls').appendChild(gotoButton);
    gotoButton.setAttribute("onclick", 'createPage(document.getElementById("recordNum").value)');

    let inputField = document.createElement('input');
    document.getElementById('controls').appendChild(inputField);
    inputField.setAttribute("value", "starting record ...");
    inputField.setAttribute("id", "recordNum");
}

// restructure functions and classes for better flow
// prev and last page button
// fill screen vs fill window or fixed window percentage vs font size
// add data from api at any time (fecth data batch, set limits on data fetch, tenaries for limits, alerts)
// enter for text field
// comments
// button space and sizing
// type strict on numbers , firstrecord, lastentry recordCount
// help button