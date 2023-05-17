const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const htmlFile = __dirname + "/public/index.html";
const assets = __dirname + "/assets";

const app = express();
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true });

app.use(cors());
app.use("/assets", express.static(assets));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(htmlFile);
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Server was started on port ${listener.address().port}`);
});
