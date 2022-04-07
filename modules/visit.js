// const axios = require("axios");
import axios from "axios";
import { parse } from "node-html-parser";
import util from 'util';
import fetch from 'node-fetch';

async function get(url) {
  console.log("Reading URL: ", url);

  //   axios
  //     .get(url, {
  //       headers: {
  //         "User-Agent":
  //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36",
  //       },
  //     })
  //     .then((res) => {
  //       //   status(res);

  //       console.log(`-------------------`);
  //       //   return res.data;
  //       data = successStatus(res);
  //     //   return data;
  //     })
  //     .catch(function (error) {
  //       if (error.response) {
  //         console.log("response error -------------------------");

  //         return responseStatus(error.response);
  //       } else if (error.request) {
  //         console.log("request error -------------------------");
  //         // console.log(error.request);

  //         return requestStatus(error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.log("Error", error.message);
  //         console.log("Caught in error else");
  //         return;
  //       }
  //     });

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36",
      },
    });
    console.log("respsonse: ");
    // console.log(res.data);

    console.log(util.inspect(res, {showHidden: false, depth: null, colors: true}))


    const htmlString = res.data;

    const doc = parse(htmlString);

    // console.log(doc);
    // console.log(util.inspect(doc, {showHidden: false, depth: null, colors: true}))

    return successStatus(res);
  } catch (error) {
    if (error.response) {
      console.log("response error -------------------------");

      console.log(util.inspect(error, {showHidden: false, depth: null, colors: true}))

      return responseStatus(error.response);
    } else if (error.request) {
      console.log("request error -------------------------");
      // console.log(error.request);

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
  console.log("status");
  console.log(response.status);
  console.log(response.statusText);

  console.log("host name");
  console.log(response.request?.host || response._currentRequest.res.host);
  console.log(response.request?.path);

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
  console.log("status");
  console.log(request._currentRequest.res.statusCode);
  console.log(request._currentRequest.res.statusMessage);

  console.log("host name");
  console.log(request._currentUrl);
  //   console.log(response.request?.host || response._currentRequest.res.host);
  //   console.log(response.request?.path);

  const status = {};

  status.code = request._currentRequest.res.statusCode;
  status.message = request._currentRequest.res.statusMessage;
  status.url = request._currentUrl;
  return status;
}

function successStatus(response) {
  console.log("status");
  console.log(response.status);
  console.log(response.statusText);

  console.log("host");
  console.log(response.request.res.responseUrl);

  const status = {};

  status.code = response.status;
  status.message = response.statusText;
  status.url = response.request.res.responseUrl;
  return status;
}

export default {
  get,
};
