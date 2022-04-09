import download from "./download.js";
import control from "./control.js";

const fileEl = document.querySelector("#excel-File");

// buttons
const visitBtn = document.querySelector(".visit-btn");
const stopBtn = document.querySelector(".stop-visit-btn");
const downloadBtn = document.querySelector(".download-btn");

// initial data storage from importing the file
let fileData;
// final data storage for the table and download
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


// Choose File button listener
fileEl.addEventListener("change", function () {
  readXlsxFile(fileEl.files[0]).then(function (data) {
    // Remove the header
    data.shift();
    fileData = data.map((row, index) => {
      control.makeTableRow(row, index);
      return row;
    });
  });
});

// start visiting each url
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

    downloadBtn.addEventListener("click", function () {
      download.csv(tableData);
    });
  }
});

async function startVisitingUrl(url, index) {
  const element = document.querySelector(`[data-row="${index}"]`);
  control.setLoader(element);
  const urlData = await sendURL(url);

  tableData[index]["code"] = urlData.code;
  tableData[index]["message"] = urlData.message;
  tableData[index]["landingUrl"] = urlData.url;

  control.setResult(element, urlData, tableData[index]);
}


