
const jwt = require("jsonwebtoken");
module.exports = {
  accessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }),

  refreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" }),
};
