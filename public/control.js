import generateHTML from "./generateHTML.js";
import util from "./util.js";

const resultTable = document.querySelector(".section-result");


function makeTableRow(row, index) {
  resultTable.insertAdjacentHTML(
    "beforeend",
    generateHTML.tableRow(row, index)
  );
}

function setLoader(element) {
  const rowElement = util.getUrlElements(element);

  rowElement.statusCodeEl.innerHTML = generateHTML.cellContentLoader();
  rowElement.statusMessageEl.innerHTML = generateHTML.cellContentLoader();
  rowElement.resultUrlEl.innerHTML = generateHTML.cellContentLoader();
  rowElement.resultUrlDomain.innerHTML = generateHTML.cellContentLoader();
  rowElement.resultNote.innerHTML = generateHTML.cellContentLoader();
}

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

function setResultStatusCodeIcon(code) {
  if (code.toString()[0] === "4") {
    return ` <span class="status-icon status-icon-red"></span>`;
  } else if (code.toString()[0] === "2") {
    return ` <span class="status-icon status-icon-green"></span>`;
  } else return ` <span class="status-icon"></span>`;
}

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

function verify(rowData) {
  const verdict = {};
  try {
    if (util.getDomain(rowData.brandUrl) != util.getDomain(rowData.landingUrl)) {
      verdict["domain"] = "Redirect Domain";
    } else {
      verdict["domain"] = "Same Domain";
    }

    if (util.getPath(rowData.brandUrl) === "/") {
      verdict["path"] = "No Path";
    } else if (util.getPath(rowData.brandUrl) != util.getPath(rowData.landingUrl)) {
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


export default {
    makeTableRow,
    setLoader,
    setResult
}