require("dotenv").config();
const express = require("express");
let bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(fileupload());
app.use(cors());

// Home page
app.use(require("./routes/index"));

// profile API
app.use("/profile", require("./routes/profile"));

// history API
app.use(
  "/history",
  (req, res, next) => {
    req.target = "history";
    next();
  },
  require("./routes/cards")
);

// favorite API
app.use(
  "/favorite",
  (req, res, next) => {
    req.target = "favorite";
    next();
  },
  require("./routes/cards")
);

// upload API
app.use("/upload", require("./routes/upload"));

// user API
app.use("/user", require("./routes/user"));

// user API
app.use("/chat", require("./routes/chat"));

// dummy data generator API (dev only)
app.use("/generate", require("./routes/generate"));

app.listen(port, () => console.log(`App listening on port ${port}!`));
