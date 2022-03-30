const xlsx = require("xlsx");
const axios = require("axios");
const visit = require("./modules/visit.js");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5252;

let url = "http://www.mediaradar.com";


app.get("/", (req, res) => {
  res.send("Here we go!");
});

app.get("/url", async (req, res) => {
  res.json(await visit.get(url));
});

// const wb = xlsx.readFile("M&A Transaction List.csv", { cellDates: true });

// console.log(wb.SheetNames);

// const ws = wb.Sheets[wb.SheetNames[0]];

// // console.log(ws);

// const data = xlsx.utils.sheet_to_json(ws);

// // console.log(data);

// console.log(data[0]["Transaction Title"]);

// const detectURL = async function() {
//     try {
//       const res = await axios.get(
//         "https://www.github.com"
//       );
//       console.log(res);
//     } catch (e) {
//       console.log("Error!", e);
//     }
//   }

//   detectURL();
//   console.log('END');

app.use((err, req, res, next) => {
  console.log("**************************");
  console.log("****ERROR****");
  console.log("**************************");
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
