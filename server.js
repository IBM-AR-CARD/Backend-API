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

//------------- History API -------------

app.get("/history/get", async function(req, res) {
  console.log("get history of id ", req.query._id);
  let obj = await db.dbFind("history", { userid: req.query._id });

  if (obj) {
    res.status(200);
    res.json(obj);
  } else {
    res.status(400);
    res.send("Not Found");
  }
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

//------------- Favorite API -------------

app.get("/favorite/get", async function(req, res) {
  console.log("get favorite of id ", req.query._id);
  let obj = await db.dbFind("favorite", { userid: req.query._id });

  if (obj) {
    res.status(200);
    res.json(obj);
  } else {
    res.status(400);
    res.send("Not Found");
  }
});

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
