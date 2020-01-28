const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;

//------------- Favorite API -------------

router.get("/get", async function(req, res) {
  console.log("get favorite of id ", req.query._id);
  let obj = await db.dbFind("favorite", { userid: "dummy" }); //req.query._id

  if (obj) {
    res.status(200);
    res.json(obj);
  } else {
    res.status(400);
    res.send("Not Found");
  }
});

module.exports = router;
