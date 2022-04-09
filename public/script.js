import download from "./download.js";
import control from "./control.js";
import util from "./util.js";

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
const brandUrlRadio = document.querySelector("#brandUrlRadio");

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

  readXlsxFile(fileEl.files[0]).then(function (data) {
    // Remove the header
    data.shift();

    fileData = data.map((row, index) => {
      control.makeTableRow(row, index, columns);
      return row;
    });

    console.log(fileData);
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
  // if it is already checked to true
  if (this.getAttribute("checked") === "") {
    this.checked = false;
    this.removeAttribute("checked");
    control.changeTables("brandId", false);
    util.adjustColumn(columns, "brandId");
  } else {
    this.checked = true;
    this.setAttribute("checked", "");
    control.changeTables("brandId", true);
    util.adjustColumn(columns, "brandId");
  }
});

// radio button listener for brand name
brandNameRadio.addEventListener("click", function () {
  // if it is already checked to true
  if (this.getAttribute("checked") === "") {
    this.checked = false;
    this.removeAttribute("checked");
    control.changeTables("brandName", false);
    util.adjustColumn(columns, "brand");
  } else {
    this.checked = true;
    this.setAttribute("checked", "");
    control.changeTables("brandName", true);
    util.adjustColumn(columns, "brand");
  }
});
