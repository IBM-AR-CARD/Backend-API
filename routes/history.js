const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;

//------------- History API -------------

router.get("/get", async function(req, res) {
  try {
    console.log("get history of id ", req.query._id);
    let id = req.query._id;
    let obj = await db.dbFind("history", { userid: id });
    if (id != "dummy" && obj) {
      await obj.history.forEach(async element => {
        let user = await db.dbFind("profile", { _id: ObjectID(element.userid) });
        element.name = user.firstname + " " + user.lastname;
        element.profile = user.profile;
        element.username = user.username;
        element.userid = user._id;
      });
    }

    if (obj && obj != {}) {
      res.status(200);
      res.json(obj);
    } else {
      res.status(400);
      res.send({ error: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
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
    res.status(400);
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
    res.status(400);
    res.send(error);
  }
});

module.exports = router;
