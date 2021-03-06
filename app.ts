﻿// Onboarding Project - 2018

let resizeTimer: number;	//delay required to reduce the number of calls made by browser when resizing the window
let controlHeight: number;	// height of the buttons div, seperate from the tables div
let tableElement: TableGenerator;

// converts strings into array and table
function parseText(textString: string) {
	textString = textString.replace(/'/g, '""');
	const outputArray = JSON.parse(textString);
	return outputArray;
}

class TableGenerator {
	element: HTMLElement;
	myTable: HTMLElement;
	firstRecord: number;
	endRecord: number;
	columnsString: string;
	recordCount: number;

	constructor(element: HTMLElement, firstRecord: number = 0) {
		this.element = element;
		this.firstRecord = firstRecord;
		this.myTable = document.createElement('table');
		this.element.appendChild(this.myTable);
	}

	// api call to get table records and display them
	getTable(start: number, end: number, tableElement) {

		const apiCall = new XMLHttpRequest();

		// create a loader div before records are ready
		const loadDiv = document.createElement('div');
		loadDiv.setAttribute('class', 'loadpage')
		tableElement.myTable.parentNode.appendChild(loadDiv);

		const loadDivc = document.createElement('div');
		loadDivc.setAttribute('class', 'loader')
		loadDiv.appendChild(loadDivc);

		apiCall.onreadystatechange = function () {
			if (apiCall.readyState === 4 && apiCall.status === 200) {

				// remove loader div when records are ready
				tableElement.myTable.parentNode.removeChild(tableElement.myTable.parentNode.lastChild)

				// store records from api call
				const recordsText = apiCall.responseText;
				const recordsTable = parseText(recordsText);

				for (const iEntry of recordsTable) {

					const tr = document.createElement('tr');
					tableElement.myTable.appendChild(tr);

					for (const jEntry of iEntry) {

						const td = document.createElement('td');
						td.appendChild(document.createTextNode(" " + jEntry));
						tr.appendChild(td);
					}
				}
				return;
			}
		}
		apiCall.open("GET", "http://localhost:2050/records?from=" + start + "&to=" + end, true);
		apiCall.send();
	}

	// callback for total record count
	recordCallback(apiCall: XMLHttpRequest) {
		return () => {
			let isDataFetched : Boolean = (apiCall.readyState === 4 && apiCall.status === 200);
			if (isDataFetched) {
				this.recordCount = JSON.parse(apiCall.responseText);
				tableElement.generateTable();
			}
			return;
		}
	}

	// makes api call to get the record count
	getRecordCount() {
		const apiCall = new XMLHttpRequest();
		apiCall.onreadystatechange = this.recordCallback(apiCall);
		apiCall.open("GET", "http://localhost:2050/recordCount", true);
		apiCall.send();
	}

	// callback for column headings
	columnCallback(apiCall: XMLHttpRequest) {
		return () => {
			let isDataFetched : Boolean = (apiCall.readyState === 4 && apiCall.status === 200);
			if (isDataFetched) {
				this.columnsString = apiCall.responseText;
				tableElement.generateTable();
			}
		}
	}

	// api call to get column headings
	getCols() {
		const apiCall = new XMLHttpRequest();
		apiCall.onreadystatechange = this.columnCallback(apiCall);
		apiCall.open("GET", "http://localhost:2050/columns", true);
		apiCall.send();
	}

	generateTable() {

		let isStaticDatafetched: Boolean = (this.columnsString === undefined || this.recordCount === undefined);
		// check if both the columns and record count calls are done then proceed to generate table
		if (isStaticDatafetched) {
			// data is not ready
			return;
		}

		if (this.firstRecord >= this.recordCount || this.firstRecord < 0) {
			// make sure first record is set with in proper limits 
			this.firstRecord = this.firstRecord < 0 ? 0 : this.firstRecord;
			this.firstRecord = this.firstRecord > this.recordCount - 1 ? this.recordCount - 1 : this.firstRecord;
			alert('please select a number between 0 and ' + (this.recordCount - 1));
			return;
		}

		this.myTable.innerHTML = ''; // empty table div to fill in a new table

		// get table height based on  remaining window size after buttons
		const contentHeight = (window.innerHeight - controlHeight);
		this.myTable.setAttribute("height", "CONTENT_HEIGHT");

		// calculate row number based on table header + row heights + borders in CSS and ensure its never less than 1
		let numRows: number = Math.floor((contentHeight - controlHeight - 26) / 46);
		numRows = numRows <= 0 ? 1 : numRows;

		// set number of records to get from server and ensure that the last record doesnt exceed the limit.
		this.endRecord = this.firstRecord - 1 + numRows;
		this.endRecord = (this.endRecord >= this.recordCount ? this.recordCount - 1 : this.endRecord);

		const columnsArray = parseText(this.columnsString);

		// write html for table header
		for (const i of columnsArray) {
			const th = document.createElement('th');
			this.myTable.appendChild(th);

			th.appendChild(document.createTextNode(" " + i));
		}
		this.getTable(this.firstRecord, this.endRecord, this);
	}

	// function used by the next page buttton, requires the last entry from previously generated table
	nextPage() {

		this.firstRecord = this.endRecord + 1;
		this.firstRecord = this.firstRecord > this.recordCount - 1 ? this.recordCount - 1 : this.firstRecord;
		this.generateTable();
	}

	// generates the first page of the data
	firstPage() {
		this.firstRecord = 0;
		this.generateTable();
	}

	// function used by the next page buttton, requires the first and last entry from previously generated table
	prevPage() {
		// if the new first entry is less than zero, take user to the first page 
		this.firstRecord = this.firstRecord - (this.endRecord - this.firstRecord) - 1;
		this.firstRecord = this.firstRecord < 0 ? 0 : this.firstRecord;
		this.generateTable();
	}
}

// hint for the user
function helpFunc() {
	alert(
		"Table for viewing records with IDs 0 to" + (this.recordCount - 1) + " (Numbers Only)."
		+ "\nTo start from a specific record enter a record ID and click 'Go To'.");
}

const customPage = () => {
	const inputVal = parseInt(this.recordNum.value);
	if (isNaN(inputVal)) {
		alert('Please type in a number')
		return;
	}
	tableElement.firstRecord = inputVal;
	tableElement.generateTable();
}

// load page for the first time and create buttons
const generateHome = () => {

	// initialise the table's parent div, create a tableElement
	let contentsDiv: HTMLElement;
	contentsDiv = document.getElementById('content');
	tableElement = new TableGenerator(contentsDiv);

	// get columns and record count,asynch
	tableElement.getRecordCount();
	tableElement.getCols();

	const controlsDiv = this.controls;
	controlHeight = controlsDiv.offsetHeight;

	// html for buttons and input text fields
	controlsDiv.innerHTML += `
 		<button onclick = "tableElement.firstPage()">First Page</button>
		<button onclick = "tableElement.prevPage()" > Prev </button>
		<button onclick = "tableElement.nextPage()" > Next </button>
		<button onclick = "customPage()"> Go To </button>
		<input value = "record..." id = "recordNum" >
		<button onclick = "helpFunc()" > Help </button>`;
}

window.onload = generateHome;

window.onresize = () => {
	const doneResizing = () => {
		tableElement.generateTable();
	}

	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(doneResizing, 500);
}
