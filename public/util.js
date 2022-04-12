// Table elements selector, since they will be used multiple times
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

// Using the web API URL to get the domain name (hostname)
function getDomain(url) {
  const domain = new URL(addProtocol(url));
  return domain.hostname.replace("www.", "");
}

// Add protocol to URL
function addProtocol(url) {
  if (!url.includes("https://") && !url.includes("http://")) {
    url = "https://" + url;
  }
  return url;
}

// Using the wbe API URL to extract the pathname
function getPath(url) {
  const fullUrl = new URL(url);
  return fullUrl.pathname;
}


// RegEx to validate if a URL format is correct
function validateURL(str) {
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

// Adjust column array
function adjustColumn(columns, colToChange) {
  if (columns.indexOf(colToChange) > -1) {
    columns.splice(columns.indexOf(colToChange), 1);
  } else {
    if (colToChange === "brandId") {
      columns.unshift(colToChange);
    } else {
      columns.splice(1, 0, colToChange);
    }
  }
}



export default {
  adjustColumn,
  addProtocol,
  getUrlElements,
  getDomain,
  getPath,
  validateURL,
};
