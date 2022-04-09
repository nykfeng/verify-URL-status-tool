import util from "./util.js";

// HTML elements for each row of data from the file
function tableRow(row, index) {
  const html = `
    <div class="result-row flex" data-row="${index}">
                  <div class="brand-id original-col col">${row[0]}</div>
                  <div class="brand original-col col">${row[1]}</div>
                  <div class="brand-url original-col col">${row[2]}</div>
                  <div class="brand-url-domain col">${
                    util.validateURL(row[2]) ? util.getDomain(row[2]) : "Not Valid"
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

// HTML element for content loader
function cellContentLoader() {
  const html = `<div class="loader"></div>`;
  return html;
}


export default {
    tableRow,
    cellContentLoader
}