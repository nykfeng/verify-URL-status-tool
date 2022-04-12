import visit from "./modules/visit.js";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5252;


app.use(express.static("./public"));

// app.get("/url", async (req, res) => {
//   res.json(await visit.get(url));
// });

app.post("/url", async (req, res) => {
  const url = req.body.url;
  res.json(await visit.get(url));
});


app.use((req, res, next) => {
  res.status(404).send("Sorry can't find the page you are looking for!");
});

app.use((err, req, res, next) => {
  console.log("**************************");
  console.log("****ERROR****");
  console.log("**************************");
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


