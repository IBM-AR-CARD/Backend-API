const express = require("express");
const router = express.Router();
let db = require("../include/db.js");
let assistant = require("../include/watson.js");
let ObjectID = require("mongodb").ObjectID;

router.post("/", async (req, res) => {
  try {
    let question = req.body;
    let user = await db.dbFind("profiles", { _id: ObjectID(question.userid) }); // reciver (being requested)
    let sender = question.senderUsername ? question.senderUsername : "anonymous";
    //TODO Add conversation logic
    // let response = `Server received question to ${user.username} from ${sender}.`;
    let response = await getWatsonResult(question.content, sender);
    let text = response.generic[0].text;

    await db.dbUpdate(
      "chats",
      { username: user.username },
      {
        $set: { username: user.username, userid: question.userid },
        $push: {
          [sender]: {
            _id: ObjectID(),
            question: question.content,
            answer: text,
            rawResponse: response
          }
        }
      }
    );

    res.status(200);
    res.json({ type: "text", answer: text, raw: response });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ error: error.message });
  }
});

// watson sessions stores key (sender username) value (session id) pair
let watsonSessions = {};

function getWatsonResult(message, sender) {
  return new Promise(async function(resolve, reject) {
    try {
      let sessionId;
      if (watsonSessions[sender]) {
        sessionId = watsonSessions[sender];
      } else {
        sessionId = await assistant.createSession();
        sessionId = sessionId.result.session_id;
        watsonSessions[sender] = sessionId;
      }
      let response = await assistant.sendMessage(sessionId, message);
      //   await assistant.deleteSession(sessionId);
      //TODO session management
      if (response && response.result) {
        resolve(response.result.output);
      } else {
        reject("no res");
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = router;
