const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
let dummy = require("../include/dummyData.js");

router.post("/register", async function(req, res) {
  let newUser = {};
  console.log(req.body);
  //clean this mess later using mongoose schema
  newUser.username = req.body.username
    ? req.body.username
    : returnError("Invalid", res);
  newUser.email = req.body.email ? req.body.email : returnError("Invalid", res);
  newUser.password = req.body.password
    ? req.body.password
    : returnError("Invalid", res);

  try {
    let findExisting = await db.dbFind("profiles", {
      username: newUser.username
    });

    if (findExisting) {
      returnError("Username already exists", res);
      return;
    }

    db.dbInsert("profiles", newUser);

    res.status(200);
    res.json({ success: "Successfully regisered, you can now log in." });
  } catch (error) {
    returnError(error, res);
  }
});

function returnError(error, res) {
  res.status(500);
  res.json({
    error: error
  });
  res.end();
}

module.exports = router;
