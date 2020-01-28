const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;

//------------- History API -------------

router.get("/get", async function(req, res) {
  console.log("get history of id ", req.query._id);
  let obj = await db.dbFind("history", { userid: "dummy" });

  if (obj) {
    res.status(200);
    res.json(obj);
  } else {
    res.status(400);
    res.send("Not Found");
  }
});

router.post("/add", async function(req, res) {
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

router.get("/remove", async function(req, res) {
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

module.exports = router;
