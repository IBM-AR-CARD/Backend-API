const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
let dummy = require("../include/dummyData.js");

router.post("/register", async function(req, res) {
  let newUser = {};
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  try {
    let findExisting = await db.dbFind("profiles", {
      username: newUser.username
    });

    if (findExisting) {
      res.status(500);
      res.json({
        error: "Username already exists"
      });
      return;
    }

    db.dbInsert("profiles", newUser);

    res.status(200);
    res.json({ success: "Successfully regisered, please now log in." });
  } catch (error) {
    res.status(500);
    res.json({
      error: error
    });
  }
});

module.exports = router;
