const express = require("express");
let bodyParser = require("body-parser");
const app = express();
const port = 8080;

let db = require("./include/db.js");
let dummy = require("./include/dummyData.js");

let ObjectID = require("mongodb").ObjectID;

app.use(bodyParser.json());

// Home page
app.use(require("./routes/index"));

// profile API
app.use("/profile", require("./routes/profile"));

// history API
app.use("/history", require("./routes/history"));

// favorite API
app.use("/favorite", require("./routes/favorite"));

//------------- Dummy data generator and remover (dev only) -------------

app.get("/profile/generate", function(req, res) {
  db.dbInsert("profiles", dummy.getProileDummy1());
  db.dbInsert("profiles", dummy.getProileDummy2());
  db.dbInsert("profiles", dummy.getProileDummy3());
  res.status(200);
  res.send("SUCCESS");
});

app.get("/history/generate", function(req, res) {
  let id = req.query._id ? req.query._id : "dummy";
  db.dbDeleteMany("history", { userid: id });
  db.dbInsert("history", dummy.getHistoryDummy(id));
  res.status(200);
  res.send("SUCCESS");
});

app.get("/favorite/generate", function(req, res) {
  let id = req.query._id ? req.query._id : "dummy";
  db.dbDeleteMany("favorite", { userid: id });
  db.dbInsert("favorite", dummy.getHistoryDummy(id));
  res.status(200);
  res.send("SUCCESS");
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
