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

function getDomain(url) {
  if (!url.includes("https://") && !url.includes("http://")) {
    url = "https://" + url;
  }
  const domain = new URL(url);
  return domain.hostname.replace("www.", "");
}

function getPath(url) {
  const fullUrl = new URL(url);
  return fullUrl.pathname;
}

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

export default {
    getUrlElements,
    getDomain,
    getPath,
    validateURL
}