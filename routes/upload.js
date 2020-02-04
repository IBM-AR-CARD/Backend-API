const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
const auth = require("../include/auth");

router.post("/", (req, res) => {
  try {
    const image = req.files.myFile;
    const path = __dirname + "/images/" + image.name;

    image.mv(path, error => {
      if (error) {
        console.error(error);
        res.status(400).json({ error: "error", message: error });
        return;
      }

      res.status(200).json({ success: "file uploaded", path: "/images/" + image.name });
    });
  } catch (error) {
    res.status(400).json({ error: "bad request" });
  }
});

module.exports = router;
