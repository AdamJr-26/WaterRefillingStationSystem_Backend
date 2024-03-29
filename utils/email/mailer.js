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
        console.log(err);
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

const sendEmail = async ({
  receiver,
  firstname,
  link,
  subject,
  title,
  content,
  description,
  buttonLabel,
}) => {
  ejs.renderFile(
    __dirname + "/templates/verification.template.ejs",
    { receiver, firstname, link, title, content, description, buttonLabel },
    async (err, data) => {
      if (err) {
        console.log("error", err);
      } else {
        var emailOptions = {
          from: "adamcompiomarcaida@gmail.com",
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
const sendOTP = async ({
  receiver,
  firstname,
  subject,
  title,
  content,
  otp,
}) => {
  ejs.renderFile(
    __dirname + "/templates/otp.template.ejs",
    { receiver, firstname, title, content, otp },
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
// wrs_name, personnel_name, address, order_details, date_of_scheduled,
// estimated_delivery_date,
const sendNotifyForDelivery = async ({
  receiver,
  subject,
  wrs_name,
  personnel_name,
  address,
  order_details,
  date_of_scheduled,
  estimated_delivery_date,
}) => {
  ejs.renderFile(
    __dirname + "/templates/incoming.delivery.ejs",
    {
      wrs_name,
      personnel_name,
      address,
      order_details,
      date_of_scheduled,
      estimated_delivery_date,
    },
    async (err, data) => {
      if (err) {
        console.log("[sending delivery email]", err);
      } else {
        var emailOptions = {
          from: process.env.GOOGLE_EMAIL,
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
const sendReceipt = async ({
  receiver,
  subject,
  wrs_name,
  personnel_name,
  address,
  date_of_delivery,
  items,
  debt_payment,
  total_payment,
}) => {
  ejs.renderFile(
    __dirname + "/templates/purchase.receipt.ejs",
    {
      receiver,
      wrs_name,
      personnel_name,
      address,
      date_of_delivery,
      items,
      debt_payment,
      total_payment,
    },
    async (err, data) => {
      if (err) {
        console.log("[sending delivery email]", err);
      } else {
        var emailOptions = {
          from: "wrsms_devs@gmail.com",
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
module.exports = {
  createTransporter,
  sendEmail,
  sendOTP,
  sendNotifyForDelivery,
  sendReceipt
};
