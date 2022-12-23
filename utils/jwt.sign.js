const jwt = require("jsonwebtoken");
const { config } = require("../config/jwt.config");

module.exports = {
  accessToken: (payload) =>
    jwt.sign(payload, config.access_token_secret, {
      expiresIn: config.access_token_secret_expiresIn,
    }),

  refreshToken: (payload) =>
    jwt.sign(payload, config.refresh_token_secret, {
      expiresIn: config.refresh_token_secret_expiresIn,
    }),
};
