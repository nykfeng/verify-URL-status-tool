import download from "./download.js";
import control from "./control.js";

const fileEl = document.querySelector("#excel-File");

// default columns
const columns = ["brandId", "brand", "brandUrl"];

// buttons
const visitBtn = document.querySelector(".visit-btn");
const stopBtn = document.querySelector(".stop-visit-btn");
const downloadBtn = document.querySelector(".download-btn");

// radio buttons
const brandIdRadio = document.querySelector("#brandIdRadio");
const brandNameRadio = document.querySelector("#brandNameRadio");

// initial data storage from importing the file
let fileData;
// final data storage for the table and download
let tableData = [];

// Choose File button listener
fileEl.addEventListener("change", function () {
  // remove existing data if any
  const existingEntries = document.querySelectorAll(".file-data-entry");
  existingEntries.forEach((entry) => {
    entry.remove();
  });

  // Using xlsx plugin
  readXlsxFile(fileEl.files[0]).then(function (data) {
    // Remove the header
    data.shift();

    fileData = data.map((row, index) => {
      control.makeTableRow(row, index, columns);
      return row;
    });
  });
});

// start visiting each url
visitBtn.addEventListener("click", async function () {
  if (fileData.length != 0) {
    for (let i = 0; i < fileData.length; i++) {
      let newRow = {};
      columns.forEach((col, index) => {
        newRow[col] = fileData[i][index];
      });
      tableData.push(newRow);
      await control.startVisitingUrl(tableData[i].brandUrl, i, tableData);
    }

    // after visiting each url, the download button will be available
    downloadBtn.addEventListener("click", function () {
      download.csv(tableData);
    });
  }
});

// radio button listener for brand ID
brandIdRadio.addEventListener("click", function () {
  control.radioBtnAdjust(columns, this, "brandId");
});

// radio button listener for brand name
brandNameRadio.addEventListener("click", function () {
  control.radioBtnAdjust(columns, this, "brand");
});
