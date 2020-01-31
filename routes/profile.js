const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;

//------------- Profile API -------------

router.post("/update", async function(req, res) {
  try {
    await db.dbUpdate(
      "profiles",
      { _id: ObjectID(req.body._id) },
      { $set: req.body }
    );
    res.status(200);
    res.send("Received, profile updated.");
  } catch (error) {
    res.status(500);
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
});

router.post("/get", async function(req, res) {
  console.log("profile get request from id " + req.body._id);
  let obj = await findProfile(req.query);

  if (obj) {
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
});

module.exports = router;
