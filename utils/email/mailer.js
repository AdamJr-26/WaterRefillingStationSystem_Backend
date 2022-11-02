const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
const ejs = require("ejs");

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err)
        reject("failed to create access Token");
      }
      resolve(token);
    });
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_EMAIL,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_ID,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
  return transporter;
};

// =======================

const sendEmail = async (receiver, link, subject, title, content, description) => {
  ejs.renderFile(
    __dirname + "/templates/verification.template.ejs",
    { receiver,link, title, content, description },
    async (err, data) => {
      if (err) {
        console.log("error", err);
      } else {
        var emailOptions = {
          from: "wrss_devs@gmail.com",
          to: receiver,
          subject: subject,
          html: data,
        };
        let emailTransporter = await createTransporter();
        emailTransporter.sendMail(emailOptions, (err, info) => {
          if (err) {
            return console.log(err);
          }
          console.log("Message sent:", info.messageId);
        });
      }
    }
  );
};

module.exports = { createTransporter, sendEmail };
