import download from "./download.js";
import control from "./control.js";
import errorHandling from "./errorHandling.js";

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
  try {
    // Using xlsx plugin
    readXlsxFile(fileEl.files[0])
      .then(function (data) {
        // Remove the header
        data.shift();

        fileData = data.map((row, index) => {
          control.makeTableRow(row, index, columns);
          return row;
        });
      })
      .catch((error) => {
        console.log(error);
        const message =
          "Error while reading the file. Please make sure you select an Excel xlsx file.";
        errorHandling.modalMessage(message);
        errorHandling.removeModalBox();
      });
  } catch (error) {
    console.log("Encountered error: ", error);
  }
});

// start visiting each url
visitBtn.addEventListener("click", async function () {
  // TODO throw error if the number of row is more than 500
  try {
    if (fileData.length > 0) {
      if (fileData.length > 500) {
        throw "Row number exceeded 500!";
      }
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
  } catch (error) {
    console.log("Encountered Error: ", error);
    const message = "Error reading data!";
    errorHandling.modalMessage(message);
    errorHandling.removeModalBox();
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
