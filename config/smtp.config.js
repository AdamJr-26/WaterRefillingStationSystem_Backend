require("dotenv").config();


module.exports = {
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SRVC,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      // pass: process.env.EMAIL_PASS,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
}