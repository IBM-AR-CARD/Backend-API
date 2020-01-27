let express = require("express");
let router = express.Router();

// GET method route
router.get("/", function(req, res) {
  res.send("GET request to the homepage");
});

// POST method route
router.post("/", function(req, res) {
  res.send("POST request to the homepage");
});

module.exports = router;
