const express = require("express");
let bodyParser = require("body-parser");
const app = express();
const port = 8080;

app.use(bodyParser.json());

// Home page
app.use(require("./routes/index"));

// profile API
app.use("/profile", require("./routes/profile"));

// history API
app.use("/history", require("./routes/history"));

// favorite API
app.use("/favorite", require("./routes/favorite"));

// user API
app.use("/user", require("./routes/user"));

// dummy data generator API (dev only)
app.use("/generate", require("./routes/generate"));

app.listen(port, () => console.log(`App listening on port ${port}!`));
