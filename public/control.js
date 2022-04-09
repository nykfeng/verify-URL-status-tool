import generateHTML from "./generateHTML.js";
import util from "./util.js";

// selectors
const resultTable = document.querySelector(".section-result");
const exampleTable = document.querySelector(".example-table");

// Change the example tables to show how it works
function changeTables(column, action) {
  let exampleCol;
  let resultCol;
  if (column === "brandId") {
    exampleCol = exampleTable.querySelectorAll(".brandIdCol");
    resultCol = resultTable.querySelector(".brand-id");
  } else if (column === "brandName") {
    exampleCol = exampleTable.querySelectorAll(".brandNameCol");
    resultCol = resultTable.querySelector(".brand");
  } else if (column === "brandUrl") {
    exampleCol = exampleTable.querySelectorAll(".brandUrlCol");
    resultCol = resultTable.querySelector(".brand-url");
  }
  exampleCol.forEach((row) => {
    row.style.display = action ? "table-cell" : "none";
  });
  resultCol.style.display = action ? "inline-block" : "none";
}

// Create table row for each row from the file
function makeTableRow(row, index) {
  resultTable.insertAdjacentHTML(
    "beforeend",
    generateHTML.tableRow(row, index)
  );
}

// Set data loader animation for each row when server is running
function setLoader(element) {
  const rowElement = util.getUrlElements(element);

  rowElement.statusCodeEl.innerHTML = generateHTML.cellContentLoader();
  rowElement.statusMessageEl.innerHTML = generateHTML.cellContentLoader();
  rowElement.resultUrlEl.innerHTML = generateHTML.cellContentLoader();
  rowElement.resultUrlDomain.innerHTML = generateHTML.cellContentLoader();
  rowElement.resultNote.innerHTML = generateHTML.cellContentLoader();
}

// Fill in data for each row after result from server visit
function setResult(element, data, tableData) {
  const rowElement = util.getUrlElements(element);
  rowElement.statusCodeEl.innerHTML =
    data.code + setResultStatusCodeIcon(data.code);
  rowElement.statusMessageEl.innerHTML = data.message;
  rowElement.resultUrlEl.innerHTML = data.url;
  rowElement.resultUrlDomain.innerHTML = util.getDomain(data.url);
  rowElement.resultNote.innerHTML =
    data.code.toString()[0] === "4" ? "Page Not Found" : verify(tableData);
  setResultVerdictColor(rowElement.resultNote, rowElement.resultNote.innerHTML);
}

// Status code icon, green or red
function setResultStatusCodeIcon(code) {
  if (code.toString()[0] === "4") {
    return ` <span class="status-icon status-icon-red"></span>`;
  } else if (code.toString()[0] === "2") {
    return ` <span class="status-icon status-icon-green"></span>`;
  } else return ` <span class="status-icon"></span>`;
}

// Final result note color
function setResultVerdictColor(noteEl, verdict) {
  if (verdict.includes("Redirect") || verdict.includes("Page Not Found")) {
    noteEl.classList.add("verdict-color-warning");
  } else if (
    verdict.includes("Same Domain No Path") ||
    verdict.includes("Same Domain Same Path")
  ) {
    noteEl.classList.add("verdict-color-greenlight");
  }
}

// Logic to verfiy final note
function verify(rowData) {
  const verdict = {};
  try {
    if (
      util.getDomain(rowData.brandUrl) != util.getDomain(rowData.landingUrl)
    ) {
      verdict["domain"] = "Redirect Domain";
    } else {
      verdict["domain"] = "Same Domain";
    }

    if (util.getPath(rowData.brandUrl) === "/") {
      verdict["path"] = "No Path";
    } else if (
      util.getPath(rowData.brandUrl) != util.getPath(rowData.landingUrl)
    ) {
      verdict["path"] = "Redirect Path";
    } else {
      verdict["path"] = "Same Path";
    }
  } catch (err) {
    console.log("Error while verifying domain and pathname: ", err);
    verdict["domain"] = "Error Accessing Domain";
    verdict["path"] = "Error Accessing Path";
  }

  rowData["note"] = verdict.domain + " " + verdict.path;
  return verdict.domain + " " + verdict.path;
}

// Post request to send url to server and check
async function sendURL(urlToVisit) {
  const url = "/url";
  const data = new URLSearchParams();
  for (const [key, value] of Object.entries({ url: urlToVisit })) {
    data.append(key, value);
  }
  const responseValue = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded  ",
    }),
    body: data,
  });

  return responseValue.json();
}

// Sending URL to server, getting result and filling in results
async function startVisitingUrl(url, index, tableData) {
  const element = document.querySelector(`[data-row="${index}"]`);
  setLoader(element);
  const urlData = await sendURL(url);

  tableData[index]["code"] = urlData.code;
  tableData[index]["message"] = urlData.message;
  tableData[index]["landingUrl"] = urlData.url;

  setResult(element, urlData, tableData[index]);
}

export default {
  changeTables,
  makeTableRow,
  setLoader,
  setResult,
  startVisitingUrl,
};
