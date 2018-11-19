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

class tableGenerator {
    element: HTMLElement;
    myTable: HTMLElement;

    constructor(element: HTMLElement, firstRecord) {
        this.element = element;
        this.myTable = document.createElement('table');
        this.element.appendChild(this.myTable);

        // get table height based on  remaining window size after buttons
        let ctrlHeight = (document.getElementById('controls').offsetHeight);
        let contentHeight = (window.innerHeight - document.getElementById('controls').offsetHeight);
        this.myTable.setAttribute("height", "contentHeight");

        // calculate row number based on table header + row heights + borders in CSS and ensure its never less than 1
        let numRows = Math.floor((contentHeight - ctrlHeight - 26) / 46);
        numRows = numRows ? 1 : numRows;
     
        // set number of records to get from server and ensure that the last record doesnt exceed the limit.
        let endRecord = (firstRecord + numRows - 1);
        endRecord = (endRecord >= recordCount ? recordCount - 1 : endRecord);

        // get data from server
        const columnsString = getData("http://localhost:2050/columns");
        let recordsText = getData("http://localhost:2050/records?from=" + firstRecord + "&to=" + endRecord);

        // parse text from api call into arrays
        const columnsArray = parseText(columnsString);
        let recordsTable = parseText(recordsText);

        // this.myTable.innerHTML += columnsArray;
        // this.myTable.innerHTML += recordCount;


        // alert(window.innerHeight - document.getElementById('controls').offsetHeight);

        // write html for table header
        for (const i of columnsArray) {
            let th = document.createElement('th');
            this.myTable.appendChild(th);

            th.appendChild(document.createTextNode(" " + i));
        }

        // write html for table
        for (const iEntry of recordsTable) {

            let tr = document.createElement('tr');
            this.myTable.appendChild(tr);

            // this.myTable.insertBefore(tr, this.myTable.firstChild); // needed if i decide to use backward fill

            for (const jEntry of iEntry) {

                let td = document.createElement('td');
                td.appendChild(document.createTextNode(" " + jEntry));
                tr.appendChild(td);
            }

            // get rid of this and use table height
            // page is overfull stop filling and remove last child // 95% needs adajustment
            // if (this.myTable.offsetHeight > (window.innerHeight - document.getElementById('controls').offsetHeight)) {
            //     this.myTable.removeChild(this.myTable.lastChild)
            //     // alert('overfull')
            //     break;
            // }
        }

        // alert(this.myTable.offsetHeight);
        // alert(window.innerHeight);
        // alert((window.innerHeight - document.getElementById('controls').offsetHeight));

    }
}

let lastEntry, currentEntry;

function createPage(firstRecord) {

    // alert(parseInt(firstRecord));
    if (firstRecord >= recordCount || firstRecord < 0 || isNaN(firstRecord)) {
        alert('please select a NUMBER between 0 and ' + (recordCount - 1));
        return;
    }

    let contentsDiv = document.getElementById('content');
    contentsDiv.innerHTML = '';
    let tableElement = new tableGenerator(contentsDiv, parseInt(firstRecord)); // setting number is slower
    lastEntry = contentsDiv.lastChild.lastChild.firstChild.textContent;
    currentEntry = firstRecord;
};

function nextPage() {
    createPage(parseInt(lastEntry) + 1);
}

function prevPage() {

    if ((lastEntry - 2 * (lastEntry - currentEntry) - 1) <= 0) {
        createPage(0);
    }
    else {
        createPage(currentEntry - (lastEntry - currentEntry) - 1);
    }
}

function helpFunc() {
    alert('Table for viewing records with IDs 0 to ' + (recordCount - 1) + '\nTo start from a specific record enter a record ID and click "Go To" \nMaximum number of viewable records is 100')
}


let resizeTimer;

window.onresize = function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doneResizing, 500);
}

function doneResizing() {
    createPage(currentEntry);
}

window.onload = () => {

    createPage(0);
    let controlsDiv = document.getElementById('controls');

    // disable browser scroll bar
    document.documentElement.style.overflow = 'hidden';

    // html for buttons and input text fields
    let startButton = document.createElement('button');
    startButton.appendChild(document.createTextNode('First Page'));
    controlsDiv.appendChild(startButton);
    startButton.setAttribute("onclick", "createPage(0)");

    let prevButton = document.createElement('button');
    prevButton.appendChild(document.createTextNode('Prev'));
    controlsDiv.appendChild(prevButton);
    prevButton.setAttribute("onclick", "prevPage()");

    let nextButton = document.createElement('button');
    nextButton.appendChild(document.createTextNode('Next'));
    controlsDiv.appendChild(nextButton);
    nextButton.setAttribute("onclick", "nextPage()");

    let gotoButton = document.createElement('button');
    gotoButton.appendChild(document.createTextNode('Go To'));
    controlsDiv.appendChild(gotoButton);
    gotoButton.setAttribute("onclick", 'createPage(document.getElementById("recordNum").value)');

    let inputField = document.createElement('input');
    controlsDiv.appendChild(inputField);
    inputField.setAttribute("value", "record...");
    inputField.setAttribute("id", "recordNum");

    let helpButton = document.createElement('button');
    helpButton.appendChild(document.createTextNode('Help'));
    controlsDiv.appendChild(helpButton);
    helpButton.setAttribute("onclick", "helpFunc()");
}



// ************************************************ NB ****************************************************
// get tr size for pre calc table size
// comments

// ********************************************************************************************************
// restructure functions and classes for better flow
// fill screen vs fill window or fixed window percentage vs font size
// add data from api at any time (fecth data batch, set limits on data fetch, tenaries for limits, alerts)
// enter for text field
// comments
// button space and sizing, small window
// type strict on numbers , firstrecord, lastentry recordCount

