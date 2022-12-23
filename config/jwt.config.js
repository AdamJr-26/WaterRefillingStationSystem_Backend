const config = {
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_secret_expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_secret_expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
};

module.exports = {
  config,
};
