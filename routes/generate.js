const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
let dummy = require("../include/dummyData.js");

//------------- Dummy data generator and remover (dev only) -------------

router.get("/profile", async function(req, res) {
  await dummy.removeProfileDummy(db, "dummy1");
  await dummy.removeProfileDummy(db, "dummy2");
  await dummy.removeProfileDummy(db, "dummy3");
  db.dbInsert("profiles", dummy.getProileDummy1());
  db.dbInsert("profiles", dummy.getProileDummy2());
  db.dbInsert("profiles", dummy.getProileDummy3());
  res.status(200);
  res.send("SUCCESS");
});

router.get("/history", function(req, res) {
  let id = req.query._id ? req.query._id : "dummy";
  db.dbDeleteMany("history", { userid: id });
  db.dbInsert("history", dummy.getHistoryDummy(id));
  res.status(200);
  res.send("SUCCESS");
});

router.get("/favorite", function(req, res) {
  let id = req.query._id ? req.query._id : "dummy";
  db.dbDeleteMany("favorite", { userid: id });
  db.dbInsert("favorite", dummy.getHistoryDummy(id));
  res.status(200);
  res.send("SUCCESS");
});

module.exports = router;
