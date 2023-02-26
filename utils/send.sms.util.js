require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendSMS = (phone, message) => {
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: "+639120090952", // change to wrs' number.
      to: phone,
    })
    .then((message) => console.log(message.sid));
};

module.exports = sendSMS;

// not used