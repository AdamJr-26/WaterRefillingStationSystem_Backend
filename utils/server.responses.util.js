const sha256 = require("sha256");

const generateHashedPassword = (password) => sha256(password);

function generateServerResponse(
  res,
  code,
  description,
  message,
  data,
  location
) {
  const fullMessage = {};
  fullMessage[location] = {
    description,
    message,
  };
  return res.status(code).json({
    code,
    data,
    fullMessage,
  });
}

function generateServerErrorCode(
  res,
  code,
  fullError,
  message,
  location = "server"
) {
  const errors = {};
  errors[location] = {
    fullError,
    message,
  };
  return res.status(code).json({
    code,
    fullError,
    errors,
  });
}
function renewJWT(res, code, accessToken, data) {
  return res
    .cookie("jwt", accessToken, {
      httpOnly: false,
      secure: false, // set to true on production.
    })
    .status(code)
    .json(data);
}

module.exports = {
  generateHashedPassword,
  generateServerErrorCode,
  generateServerResponse,
  renewJWT,
};
