import download from "./download.js";

const submitEL = document.querySelector(".row-submit");
const fileEl = document.querySelector("#excel-File");
const uploadBtn = document.querySelector(".upload-btn");
const resultTable = document.querySelector(".section-result");

// buttons
const visitBtn = document.querySelector(".visit-btn");
const stopBtn = document.querySelector(".stop-visit-btn");
const downloadBtn = document.querySelector(".download-btn");

let fileData;
let tableData = [];

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

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

fileEl.addEventListener("change", function () {
  readXlsxFile(fileEl.files[0]).then(function (data) {
    // Remove the header
    data.shift();
    fileData = data.map((row, index) => {
      generateTableRow(row, index);
      return row;
    });
  });
});

function generateTableRow(row, index) {
  resultTable.insertAdjacentHTML("beforeend", rowHTML(row, index));
}

function rowHTML(row, index) {
  const html = `
  <div class="result-row flex" data-row="${index}">
                <div class="brand-id original-col col">${row[0]}</div>
                <div class="brand original-col col" data-hover="${row[1]}">${
    row[1]
  }</div>
                <div class="brand-url original-col col" data-hover="${
                  row[2]
                }">${row[2]}</div>

                <div class="brand-url-domain col">${
                  validURL(row[2]) ? getDomain(row[2]) : "Not Valid"
                }</div>
                <div class="result-status-code col"></div>
                <div class="result-message col"></div>
                <div class="result-url col"></div>
                <div class="result-url-domain col"></div>
                <div class="result-verdict col"></div>
            </div>
  `;
  return html;
}

function getDomain(url) {
  if (!url.includes("https://") && !url.includes("http://")) {
    url = "https://" + url;
  }
  const domain = new URL(url);
  return domain.hostname.replace("www.", "");
}

visitBtn.addEventListener("click", async function () {
  if (fileData.length != 0) {
    for (let i = 0; i < fileData.length; i++) {
      tableData.push({
        brandId: fileData[i][0],
        brand: fileData[i][1],
        brandUrl: fileData[i][2],
      });
      await startVisitingUrl(fileData[i][2], i);
    }
    console.log("Let s seet the table data array");
    console.log(tableData);

    downloadBtn.addEventListener('click', function() {
      download.csv(tableData);
    })
  }
});

async function startVisitingUrl(url, index) {
  // for extracting elements, index has to + 1, since it starts at 0
  const element = document.querySelector(`[data-row="${index}"]`);
  setLoader(element);
  const urlData = await sendURL(url);

  tableData[index]["code"] = urlData.code;
  tableData[index]["message"] = urlData.message;
  tableData[index]["landingUrl"] = urlData.url;

  setResult(element, urlData, tableData[index]);
}

function loaderHTML() {
  const html = `<div class="loader"></div>`;
  return html;
}

function setLoader(element) {
  const rowElement = getUrlElements(element);

  rowElement.statusCodeEl.innerHTML = loaderHTML();
  rowElement.statusMessageEl.innerHTML = loaderHTML();
  rowElement.resultUrlEl.innerHTML = loaderHTML();
  rowElement.resultUrlDomain.innerHTML = loaderHTML();
  rowElement.resultNote.innerHTML = loaderHTML();
}

function getUrlElements(element) {
  const statusCodeEl = element.querySelector(".result-status-code");
  const statusMessageEl = element.querySelector(".result-message");
  const resultUrlEl = element.querySelector(".result-url");
  const resultUrlDomain = element.querySelector(".result-url-domain");
  const resultNote = element.querySelector(".result-verdict");

  return {
    statusCodeEl,
    statusMessageEl,
    resultUrlEl,
    resultUrlDomain,
    resultNote,
  };
}

function setResult(element, data, tableData) {
  const rowElement = getUrlElements(element);
  rowElement.statusCodeEl.innerHTML =
    data.code + setResultStatusCodeIcon(data.code);
  rowElement.statusMessageEl.innerHTML = data.message;
  rowElement.resultUrlEl.innerHTML = data.url;
  rowElement.resultUrlDomain.innerHTML = getDomain(data.url);
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

function getPath(url) {
  const fullUrl = new URL(url);
  return fullUrl.pathname;
}

function verify(rowData) {
  const verdict = {};
  try {
    if (getDomain(rowData.brandUrl) != getDomain(rowData.landingUrl)) {
      verdict["domain"] = "Redirect Domain";
    } else {
      verdict["domain"] = "Same Domain";
    }

    if (getPath(rowData.brandUrl) === "/") {
      verdict["path"] = "No Path";
    } else if (getPath(rowData.brandUrl) != getPath(rowData.landingUrl)) {
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

// function writeToExcelFile() {
//   console.log(xlsx);
//   const newWB = xlsx.utils.book_new();
//   console.log("new wookbook");
//   console.log(newWB);
//   const newWS = xlsx.utils.json_to_sheet([{ "a-header": "a", "b-header": "b" }]);
//   console.log(newWS);

//   xlsx.utils.book_append_sheet((newWB, newWS, "New Data"))

//   xlsx.writeFile(newWB, "New Data File.xlsx");
// }

// writeToExcelFile();
