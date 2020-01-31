const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
let dummy = require("../include/dummyData.js");
const validator = require("validator");

router.post("/register", async function(req, res) {
  let newUser = {};
  console.log(req.body);
  //clean this mess later using mongoose schema
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  let isInvalid = isInvalidNewUser(newUser);
  if (isInvalid) {
    return returnError(isInvalid, res);
  }

  try {
    let findExisting = await db.dbFind("profiles", {
      username: { $regex: new RegExp(newUser.username, "i") } // regex used for case insensitive
    });

    if (findExisting) {
      return returnError("Username already exists", res);
    }

    db.dbInsert("profiles", newUser);

    res.status(200);
    res.json({ success: "Successfully regisered, you can now log in." });
  } catch (error) {
    return returnError(error, res);
  }
});

function returnError(error, res) {
  res.status(500);
  return res.json({
    error: error
  });
}

function isInvalidNewUser(newUser) {
  let invalid = null;
  if (validator.isEmpty(newUser.username)) {
    return "Username cannot be empty";
  }
  if (validator.isEmpty(newUser.email)) {
    return "E-mail cannot be empty";
  }
  if (validator.isEmpty(newUser.password)) {
    return "Password cannot be empty";
  }
  if (!validator.isEmail(newUser.email)) {
    return "Your email address format is incorrect";
  }
  if (!validator.isAlphanumeric(newUser.username)) {
    return "Your username format is incorrect";
  }
  if (!validator.isLength(newUser.username, { min: 3, max: 25 })) {
    return "Your username length is invalid";
  }
  if (!validator.isLength(newUser.password, { min: 5, max: 25 })) {
    return "Your password length is invalid";
  }
}

module.exports = router;
