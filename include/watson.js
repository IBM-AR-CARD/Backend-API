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

module.exports = {
  createSession: function() {
    return new Promise(function(resolve, reject) {
      assistant
        .createSession({
          assistantId: process.env.WATSON_ASSISTANT_ID
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
