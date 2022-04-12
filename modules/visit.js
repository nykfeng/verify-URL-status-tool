import axios from "axios";

async function get(url) {
  console.log("Server reading URL: ", url);
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36",
      },
    });

    // console.log(util.inspect(res, {showHidden: false, depth: null, colors: true}))
    return successStatus(res);
  } catch (error) {
    if (error.response) {
      console.log("response error -------------------------");

      // console.log(util.inspect(error, {showHidden: false, depth: null, colors: true}))

      return responseStatus(error.response);
    } else if (error.request) {
      console.log("request error --------------------------");
      console.log(error.request);
      // console.log(util.inspect(error.request, {showHidden: false, depth: null, colors: true}));


      return requestStatus(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      console.log("Caught in error else");
      return;
    }
  }
}

function responseStatus(response) {
  const status = {};

  status.code = response.status;
  status.message = response.statusText;
  status.url =
    (response.request?.host || response._currentRequest.res.host) +
    response.request?.path;
  console.log(status);
  return status;
}

function requestStatus(request) {
  const status = {};

  status.code = request._currentRequest.res?.statusCode || "404";
  status.message =
    request._currentRequest.res?.statusMessage || "Page Not Found";
  status.url = request._currentUrl;
  console.log(status);
  return status;
}

function successStatus(response) {
  const status = {};

  status.code = response.status;
  status.message = response.statusText;
  status.url = response.request.res.responseUrl;
  return status;
}

export default {
  get,
};
