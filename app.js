// const xlsx = require("xlsx");
// const visit = require("./modules/visit.js");


import visit from "./modules/visit.js";
import axios from "axios";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT || 5252;

// let url = "http://www.mediaradar.com";
let url = "http://www.lhj.com";


app.use(express.static("./public"));


app.get("/url", async (req, res) => {
  res.json(await visit.get(url));
});

app.post('/url', async(req, res)=> {
  console.log('Req.body is ');
  console.log(req.body);
  // console.log(req);
  const url = req.body.url;

  res.json(await visit.get(url));
})

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

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find the page you are looking for!")
})

app.use((err, req, res, next) => {
  console.log("**************************");
  console.log("****ERROR****");
  console.log("**************************");
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
