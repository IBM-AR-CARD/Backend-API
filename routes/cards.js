const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
const auth = require("../include/auth");

//------------- History and Favourites API -------------

router.get("/get", auth, async function(req, res) {
  try {
    let id = req.query._id == "dummy" ? "dummy" : req.jwt_user._id;
    console.log(`get ${req.target} of id`, id);
    let obj = await db.dbFind(req.target, { userid: id });
    if (id != "dummy" && obj) {
      for (let element of obj.list) {
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
      res.status(200);
      res.send({ list: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});

router.post("/add", auth, async function(req, res) {
  console.log(req.body);

  try {
    console.log(`add ${req.target} of id `, req.jwt_user._id);
    await db.dbUpdate(
      req.target,
      {
        userid: req.jwt_user._id
      },
      {
        $set: { userid: req.jwt_user._id },
        $pull: {
          list: { userid: req.body.userid }
        }
      }
    );
    await db.dbUpdate(
      req.target,
      { userid: req.jwt_user._id },
      {
        $set: { userid: req.jwt_user._id },
        $push: { list: { userid: req.body.userid, _id: ObjectID() } }
      }
    );

    res.status(200);
    res.json({ success: `${req.target} updated` });
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
});

router.post("/remove", auth, async function(req, res) {
  try {
    console.log(`removing ${req.target} of id `, req.jwt_user._id);
    await db.dbUpdate(
      req.target,
      { userid: req.jwt_user._id },
      {
        $set: { userid: req.jwt_user._id },
        $pull: { list: { userid: req.body.userid } }
      }
    );
    res.status(200);
    res.json({ success: `${req.target} might be removed` });
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
});

router.post("/remove-all", auth, async function(req, res) {
  try {
    console.log(`removing all ${req.target} of id `, req.jwt_user._id);
    await db.dbUpdate(
      req.target,
      { userid: req.jwt_user._id },
      {
        $set: { userid: req.jwt_user._id, list: [] }
      }
    );
    res.status(200);
    res.json({ success: `${req.target} is cleared` });
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
});

module.exports = router;
