const express = require("express");
let bodyParser = require("body-parser");
let db = require("./db.js");
let dummy = require("./dummyData.js");
const app = express();
const port = 8080;

let ObjectID = require("mongodb").ObjectID;

app.use(bodyParser.json());

// GET method route
app.get("/", function(req, res) {
  res.send("GET request to the homepage");
});

// POST method route
app.post("/", function(req, res) {
  res.send("POST request to the homepage");
});

//------------- Profile API -------------

app.post("/profile/update", async function(req, res) {
  try {
    await db.dbUpdate(
      "profiles",
      { _id: ObjectID(req.body._id) },
      { $set: req.body }
    );
    res.send("Received, profile updated.");
  } catch (error) {
    res.send(error);
  }
});

app.get("/profile/get", async function(req, res) {
  let obj = await db.dbFind("profiles", {});

  res.status(200);
  res.json(obj[0]);
});

//------------- History API -------------

app.get("/history/get", async function(req, res) {
  console.log("get history of id ", req.query._id);
  let obj = await db.dbFind("history", { userid: req.query._id });

  res.status(200);
  res.json(obj);
});

app.post("/history/add", async function(req, res) {
  console.log(req.body);

  try {
    console.log("add history of id ", req.query._id);
    await db.dbUpdate(
      "history",
      {
        userid: req.query._id
      },
      {
        $set: { userid: req.query._id },
        $pull: {
          history: { userid: req.body.userid }
        }
      }
    );
    await db.dbUpdate(
      "history",
      { userid: req.query._id },
      { $set: { userid: req.query._id }, $push: { history: req.body } }
    );

    res.status(200);
    res.send("history updated");
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

app.get("/history/remove", async function(req, res) {
  try {
    console.log("removing history of id ", req.query._id);
    await db.dbUpdate(
      "history",
      { userid: req.query._id },
      {
        $set: { userid: req.query._id },
        $pull: { history: { userid: req.query.userid } }
      }
    );
    res.status(200);
    res.send("history might be removed");
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

//------------- Dummy data generator -------------

app.get("/profile/generate", function(req, res) {
  db.dbInsert("profiles", dummy.getProileDummy());
  res.status(200);
  res.json("SUCCESS");
});

app.get("/history/generate", function(req, res) {
  db.dbInsert("history", dummy.getHistoryDummy());
  res.status(200);
  res.json("SUCCESS");
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
