const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
const auth = require("../include/auth");

//------------- History and Favourites API -------------

router.get("/get", async function(req, res) {
  try {
    console.log(`get ${req.target} of id`, req.query._id);
    let id = req.query._id;
    let obj = await db.dbFind(req.target, { userid: id });
    if (id != "dummy" && obj) {
      for (let element of obj[req.target]) {
        let user = await db.dbFind("profiles", { _id: ObjectID(element.userid) });
        element.name = user.firstname + " " + user.lastname;
        element.profile = user.profile;
        element.username = user.username;
        element.userid = user._id;
      }
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
    console.log(`add ${req.target} of id `, req.query._id);
    await db.dbUpdate(
      req.target,
      {
        userid: req.query._id
      },
      {
        $set: { userid: req.query._id },
        $pull: {
          [req.target]: { userid: req.body.userid }
        }
      }
    );
    await db.dbUpdate(
      req.target,
      { userid: req.query._id },
      { $set: { userid: req.query._id }, $push: { [req.target]: req.body } }
    );

    res.status(200);
    res.json({ success: `${req.target} updated` });
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
});

router.get("/remove", async function(req, res) {
  try {
    console.log(`removing ${req.target} of id `, req.query._id);
    await db.dbUpdate(
      req.target,
      { userid: req.query._id },
      {
        $set: { userid: req.query._id },
        $pull: { [req.target]: { userid: req.query.userid } }
      }
    );
    res.status(200);
    res.json({ success: `${req.target} might be removed` });
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
});

module.exports = router;
