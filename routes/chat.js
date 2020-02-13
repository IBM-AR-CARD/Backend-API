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
    let response = await getWatsonResult(question.content, sender, user);
    let text = response.generic[0].text;

    let processedText = handleResult(text, user);

    await db.dbUpdate(
      "chats",
      { username: user.username },
      {
        $set: { username: user.username, userid: question.userid },
        $push: {
          [sender]: {
            _id: ObjectID(),
            question: question.content,
            answer: processedText,
            rawResponse: response
          }
        }
      }
    );

    res.status(200);
    res.json({ type: "text", answer: processedText, raw: response });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ error: error.message });
  }
});

// watson sessions stores key (sender username) value (session id) pair
let watsonSessions = {};

async function getWatsonResult(message, sender) {
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
      if (response && response.result) {
        resolve(response.result.output);
      } else {
        reject("no res");
      }
    } catch (error) {
      if (error.message == "Invalid Session") {
        delete watsonSessions[sender];
        console.log("session removed!!!!!!!!");
        resolve(await getWatsonResult(message, sender));
      }
      reject(error);
    }
  });
}

function handleResult(text, user) {
  const actionRegex = /%%.+[*].+%%/gi;
  const match = text.match(actionRegex);
  if (match) {
    const part = match[0].replace(/%%/gi, "").split("*");
    const content = user[part[1]];
    if (part[0] == "profile") {
      if (content) {
        return content;
      } else {
        return "I haven't wrote my " + part[1] + " yet, check back later!";
      }
    }
  }
  const name = user.firstname && user.lastname ? user.firstname + " " + user.lastname : "(Unkown)";
  return text.replace(/[*][*]name[*][*]/gi, name);
}

module.exports = router;
