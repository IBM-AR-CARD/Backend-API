const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;
let dummy = require("../include/dummyData.js");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ------------------ user registration api ------------------
router.post("/register", async function(req, res) {
  let newUser = {};
  console.log(req.body);
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  let isInvalid = isInvalidUser(newUser);
  if (isInvalid) {
    return returnError(isInvalid, res);
  }

  try {
    let findExisting = await db.dbFind("profiles", {
      $or: [
        { username: { $regex: new RegExp(newUser.username, "i") } },
        { email: { $regex: new RegExp(newUser.email, "i") } }
      ] // regex used for case insensitive
    });

    if (findExisting) {
      return returnError("Username or email already exists", res);
    }

    //hash password
    newUser.password = await bcrypt.hash(newUser.password, 8);

    await db.dbInsert("profiles", newUser);

    res.status(200);
    res.json({ success: "Successfully regisered, you can now log in." });
  } catch (error) {
    return returnError(error, res);
  }
});

// ------------------ user login api ------------------
router.post("/login", async function(req, res) {
  let loginUser = {};
  console.log(req.body);
  loginUser.email = req.body.email;
  loginUser.password = req.body.password;

  let isInvalid = isInvalidUser(loginUser, true);
  if (isInvalid) {
    return returnError(isInvalid, res);
  }

  try {
    const user = await db.dbFind("profiles", { email: loginUser.email });

    if (!user) {
      console.log("User not found");
      return returnError(
        "Failed to log in, your email or password is incorrect",
        res
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      loginUser.password,
      user.password
    );
    if (!isPasswordMatch) {
      console.log("User password incorrect");
      return returnError("Failed to log in, your password is incorrect", res);
    }

    let token = await signJWT(user);

    res.status(200);
    res.json({ success: "Successfully logged in.", token: token });
  } catch (error) {
    console.log(error);
    return returnError(error, res);
  }
});

// ------------------ hepler functions ------------------

function returnError(error, res) {
  res.status(500);
  return res.json({
    error: error
  });
}

async function signJWT(user) {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  if (!user.tokens) user.tokens = [];
  if (user.tokens.length >= 2) user.tokens.shift();
  user.tokens = user.tokens.concat(token);
  await db.dbUpdate("profiles", { _id: ObjectID(user._id) }, { $set: user }); //store jwt
  return token;
}

function isInvalidUser(newUser, ignoreUsername) {
  if (!ignoreUsername && validator.isEmpty(newUser.username)) {
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
  if (!ignoreUsername && !validator.isAlphanumeric(newUser.username)) {
    return "Your username format is incorrect";
  }
  if (
    !ignoreUsername &&
    !validator.isLength(newUser.username, { min: 3, max: 25 })
  ) {
    return "Your username length is invalid";
  }
  if (!validator.isLength(newUser.password, { min: 5, max: 25 })) {
    return "Your password length is invalid";
  }
}

module.exports = router;
