import util from "./util.js";

// HTML elements for each row of data from the file
function tableRow(row, index, columns) {
  const html = `
    <div class="result-row flex file-data-entry" data-row="${index}">
        
                  ${rowColumn(row, columns)}
                  
                  <div class="result-status-code col"></div>
                  <div class="result-message col"></div>
                  <div class="result-url col"></div>
                  <div class="result-url-domain col"></div>
                  <div class="result-verdict col"></div>
              </div>
    `;
  return html;
}


// Generate row and column dynamically
function rowColumn(row, columns) {
  let html = "";
  columns.forEach((col, index) => {
    html += `<div class="${col} original-col col">${row[index]}</div>`;
  });

  html += `<div class="brand-url-domain col">${
    util.validateURL(row[row.length - 1])
      ? util.getDomain(row[row.length - 1])
      : "Not Valid"
  }</div>`;
  return html;
}

// HTML element for content loader
function cellContentLoader() {
  const html = `<div class="loader"></div>`;
  return html;
}

export default {
  tableRow,
  cellContentLoader,
};
