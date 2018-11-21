// Onboarding Project - 2018

const RECORD_COUNT: number = JSON.parse(getData("http://localhost:2050/recordCount"));
let resizeTimer; // delay required to reduce the number of calls made by browser when resizing the window
let CONTROLS_HEIGHT;


// makes api call and returns data
function getData(dataLink: string) {
	const apiCall = new XMLHttpRequest();
	apiCall.open("GET", dataLink, false);
	apiCall.send();
	return apiCall.responseText;
}

// converts strings into array and table
function parseText(textString: string) {
	textString = textString.replace(/'/g, '""');
	const outputArray = JSON.parse(textString);
	return outputArray;
}

class tableGenerator {
	element: HTMLElement;
	myTable: HTMLElement;
	firstRecord: number;
	endRecord: number;

	constructor(element: HTMLElement, firstRecord: number = 0) {
		this.element = element;
		this.firstRecord = firstRecord;
		this.myTable = document.createElement('table');
	}
	generateTable() {

		if (this.firstRecord >= RECORD_COUNT || this.firstRecord < 0) {
			// make sure first record is set with in proper limits 
			this.firstRecord = this.firstRecord < 0 ? 0 : this.firstRecord;
			this.firstRecord = this.firstRecord > RECORD_COUNT - 1 ? RECORD_COUNT - 1 : this.firstRecord;
			alert('please select a number between 0 and ' + (RECORD_COUNT - 1));
			return;
		}
		this.myTable.innerHTML = ''; // empty table div to fill in a new table
		this.element.appendChild(this.myTable);

		// get table height based on  remaining window size after buttons
		const contentHeight = (window.innerHeight - CONTROLS_HEIGHT);
		this.myTable.setAttribute("height", "contentHeight");

		// calculate row number based on table header + row heights + borders in CSS and ensure its never less than 1
		let numRows: number = Math.floor((contentHeight - CONTROLS_HEIGHT - 26) / 46);
		numRows = numRows <= 0 ? 1 : numRows;

		// set number of records to get from server and ensure that the last record doesnt exceed the limit.
		this.endRecord = this.firstRecord - 1 + numRows;
		this.endRecord = (this.endRecord >= RECORD_COUNT ? RECORD_COUNT - 1 : this.endRecord);

		// get data from server
		const columnsString: string = getData("http://localhost:2050/columns");
		const recordsText: string = getData("http://localhost:2050/records?from=" + this.firstRecord + "&to=" + this.endRecord);

		// parse text from api call into arrays
		const columnsArray = parseText(columnsString);
		const recordsTable = parseText(recordsText);

		// write html for table header
		for (const i of columnsArray) {
			const th = document.createElement('th');
			this.myTable.appendChild(th);

			th.appendChild(document.createTextNode(" " + i));
		}

		// write html for table
		for (const iEntry of recordsTable) {

			const tr = document.createElement('tr');
			this.myTable.appendChild(tr);

			for (const jEntry of iEntry) {

				const td = document.createElement('td');
				td.appendChild(document.createTextNode(" " + jEntry));
				tr.appendChild(td);
			}
		}
	}

	// function used by the next page buttton, requires the last entry from previously generated table
	nextPage() {

		this.firstRecord = this.endRecord + 1;
		// this.firstRecord = this.firstRecord > RECORD_COUNT - 1 ? RECORD_COUNT - 1 : this.firstRecord;
		this.generateTable();
	}

	firstPage() {
		this.firstRecord = 0;
		this.generateTable();
	}

	// function used by the next page buttton, requires the first and last entry from previously generated table
	prevPage() {
		// if the new first entry is less than zero, take user to the first page 
		this.firstRecord = this.firstRecord - (this.endRecord - this.firstRecord) - 1;
		// this.firstRecord = this.firstRecord < 0 ? 0 : this.firstRecord;
		this.generateTable();
	}
}

// hint for the user
function helpFunc() {
	alert(
		"Table for viewing records with IDs 0 to" + (RECORD_COUNT - 1) + " (Numbers Only)."
		+ "\nTo start from a specific record enter a record ID and click 'Go To'.");
}

let customPage = () => {
	let inputVal = parseInt(this.recordNum.value);
	if (isNaN(inputVal)) {
		alert('Please type in a number')
		return;
	}
	tableElement.firstRecord
	tableElement.generateTable();
}

window.onresize = () => {
	const doneResizing = () => {
		tableElement.generateTable();
	}

	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(doneResizing, 500);
}

let contentsDiv2: HTMLElement;
let tableElement: tableGenerator;

// load page for the first time and create buttons
window.onload = () => {

	const controlsDiv = this.controls;
	CONTROLS_HEIGHT = controlsDiv.offsetHeight;

	// html for buttons and input text fields
	controlsDiv.innerHTML += `
 		<button onclick = "tableElement.firstPage()">First Page</button>
		<button onclick = "tableElement.prevPage()" > Prev </button>
		<button onclick = "tableElement.nextPage()" > Next </button>
		<button onclick = "customPage()"> Go To </button>
		<input value = "record..." id = "recordNum" >
		<button onclick = "helpFunc()" > Help </button>`;

	// initialise the table's parent div, create a tableElement and generate default table
	contentsDiv2 = document.getElementById('content');
	tableElement = new tableGenerator(contentsDiv2);
	tableElement.generateTable();
}


