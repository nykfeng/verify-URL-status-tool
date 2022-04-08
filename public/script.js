const submitEL = document.querySelector(".row-submit");
const fileEl = document.querySelector("#excel-File");
const uploadBtn = document.querySelector(".upload-btn");
const resultTable = document.querySelector(".section-result");

// buttons
const visitBtn = document.querySelector(".visit-btn");
const stopBtn = document.querySelector(".stop-visit-btn");

let fileData;
// submitEL.addEventListener("click", function () {
//   sendURL("https://www.mediaradar.com");
// });

let tableData = [];

// Post request to send url to server and check
async function sendURL(urlToVisit) {
  const url = "/url";
  const data = new URLSearchParams();
  for (const [key, value] of Object.entries({ url: urlToVisit })) {
    data.append(key, value);
  }
  responseValue = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded  ",
    }),
    body: data,
  });

  console.log("Response value: ");
  // console.log(await responseValue.json());
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
    console.log("Data from file is ");
    console.log(data);
    fileData = data.map((row, index) => {
      generateTableRow(row, index);
      return row;
    });
    console.log("file data is ");
    console.log(fileData);
  });
});

function generateTableRow(row, index) {
  resultTable.insertAdjacentHTML("beforeend", rowHTML(row, index));
}

function rowHTML(row, index) {
  // element.dataset.row = index
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
    // start at row 1 instead of 0 because of header

    for (let i = 0; i < fileData.length; i++) {
      tableData.push({
        brandId: fileData[i][0],
        brand: fileData[i][1],
        brandUrl: fileData[i][2],
      });
      await startVisitingUrl(fileData[i][2], i);
    }
  }
  // startVisitingUrl("www.ap555ple.com");
});

async function startVisitingUrl(url, index) {
  // for extracting elements, index has to + 1, since it starts at 0
  const element = document.querySelector(`[data-row="${index}"]`);
  setLoader(element);
  const urlData = await sendURL(url);
  console.log("table data");
  console.log(tableData[index]);
  tableData[index]["code"] = urlData.code;
  tableData[index]["message"] = urlData.message;
  tableData[index]["landingUrl"] = urlData.url;

  console.log(urlData);
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
  rowElement.statusCodeEl.innerHTML = data.code;
  rowElement.statusMessageEl.innerHTML = data.message;
  rowElement.resultUrlEl.innerHTML = data.url;
  rowElement.resultUrlDomain.innerHTML = getDomain(data.url);
  rowElement.resultNote.innerHTML = verify(tableData);
}

function getPath(url) {
  const fullUrl = new URL(url);
  return fullUrl.pathname;
}

function verify(rowData) {
  const verdict = {};
  try {
    if (getDomain(rowData.brandUrl) != getDomain(rowData.landingUrl)) {
      verdict["domain"] = "Different Domain";
    } else {
      verdict["domain"] = "Same Domain";
    }

    if (getPath(rowData.brandUrl) === "/") {
      verdict["path"] = 'No Path';
    } else if (getPath(rowData.brandUrl) != getPath(rowData.landingUrl)) {
      verdict["path"] = "Different Path";
    } else {
      verdict["path"] = "Same Path";
    }
  } catch (err) {
    console.log("Error while verifying domain and pathname: ", err);
    verdict["domain"] = "Error Accessing Domain";
    verdict["path"] = "Error Accessing Path";
  }

  return verdict.domain + " " + verdict.path;
}
