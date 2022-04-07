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
  const domain = new URL(url);
  return domain.hostname.replace("www.", "");
}

visitBtn.addEventListener("click", function () {
  if (fileData.length != 0) {
    startVisitingUrl(fileData[0][2]);
  }
  // startVisitingUrl("www.ap555ple.com");
});

async function startVisitingUrl(url) {
  const urlData = await sendURL(url);
  console.log(urlData);
}
