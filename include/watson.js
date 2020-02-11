const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const assistant = new AssistantV2({
  version: process.env.WATSON_VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_KEY
  }),
  url: "https://api.eu-gb.assistant.watson.cloud.ibm.com",
  disableSslVerification: true // TODO Turn off after ssl
});

const assistant_id = process.env.WATSON_ASSISTANT_ID;

module.exports = {
  createSession: async function() {
    return new Promise(function(resolve, reject) {
      assistant
        .createSession({
          assistantId: assistant_id
        })
        .then(res => {
          console.log(JSON.stringify(res, null, 2));
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },

  deleteSession: async function(session_id) {
    return new Promise(function(resolve, reject) {
      assistant
        .deleteSession({
          assistantId: assistant_id,
          sessionId: session_id
        })
        .then(res => {
          console.log(JSON.stringify(res, null, 2));
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },

  sendMessage: async function(session_id, message) {
    return new Promise(function(resolve, reject) {
      assistant
        .message({
          assistantId: assistant_id,
          sessionId: session_id,
          input: {
            message_type: "text",
            text: message
          }
        })
        .then(res => {
          console.log(JSON.stringify(res, null, 2));
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
};
