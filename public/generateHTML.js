import util from "./util.js";

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

function cellContentLoader() {
  const html = `<div class="loader"></div>`;
  return html;
}


export default {
    tableRow,
    cellContentLoader
}