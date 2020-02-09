const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
const auth = require("../include/auth");

router.post("/", auth, (req, res) => {
  try {
    const mFile = req.files.file;
    const rootDir = __dirname + process.env.UPLOAD_FOLDER;
    const userDir = req.jwt_user.username + "/";
    const dir = rootDir + userDir;
    const path = dir + mFile.name;

    const fs = require("fs");
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir);
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    mFile.mv(path, error => {
      if (error) {
        console.error(error);
        res.status(400).json({ error: "error", message: error });
        return;
      }

      res.status(200).json({
        success: "file uploaded",
        path: process.env.SERVER_ADDRESS + "/uploads/" + userDir + mFile.name
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "bad request" });
  }
});

module.exports = router;
