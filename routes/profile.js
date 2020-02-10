const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;

//------------- Profile API -------------

router.post("/update", async function(req, res) {
  try {
    await db.dbUpdate("profiles", { _id: ObjectID(req.body._id) }, { $set: req.body });
    res.status(200);
    res.send("Received, profile updated.");
  } catch (error) {
    res.status(400);
    res.json({
      error: error
    });
  }
});

async function findProfile(body) {
  let query = {};
  if (body._id) query._id = ObjectID(body._id);
  if (body.username) query.username = body.username;

  let obj = await db.dbFind("profiles", query);
  return obj;
}

router.get("/get", async function(req, res) {
  try {
    let obj = await findProfile(req.query);

    if (obj) {
      res.status(200);
      res.send(`Want to view ${obj.firstname}'s AR Avatar? Download our router!`);
    } else {
      res.status(400);
      res.json({
        error: "not-found"
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/get", async function(req, res) {
  try {
    const requesterId = req.body._id;
    console.log("profile get request from id " + requesterId);
    let obj = await findProfile(req.query);

    if (obj) {
      //check if the profile is in user's favourite
      if (requesterId) {
        let fav = await db.dbFind("favorite", { userid: ObjectID(requesterId) });
        if (fav && fav.favorite) {
          const found = fav.favorite.find(element => element.userid == obj._id);
          obj.isFav = found ? true : false;
        } else {
          obj.isFav = false;
        }
      }

      delete obj.password;
      delete obj.email;
      delete obj.tokens;
      res.status(200);
      res.json(obj);
    } else {
      res.status(400);
      res.json({
        error: "not-found"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
