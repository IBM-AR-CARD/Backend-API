const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let ObjectID = require("mongodb").ObjectID;

router.post("/", async (req, res) => {
  try {
    let question = req.body;
    let user = await db.dbFind("profiles", { _id: ObjectID(question.userid) }); // reciver (being requested)
    let sender = question.senderUsername ? question.senderUsername : "anonymous";
    //TODO Add conversation logic
    let response = `Server received question to ${user.username} from ${sender}.`;

    await db.dbUpdate(
      "chats",
      { username: user.username },
      {
        $set: { username: user.username, userid: question.userid },
        $push: { [sender]: { _id: ObjectID(), question: question.content, response: response } }
      }
    );

    res.status(200);
    res.json({ type: "text", content: response });
  } catch (error) {
    res.status(400);
    res.json({ error: error });
  }
});

module.exports = router;
