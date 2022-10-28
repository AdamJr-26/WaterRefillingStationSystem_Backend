const sha256 = require("sha256");

const { check } = require("express-validator");

const {
  PASSWORD_IS_EMPTY,
  PASSWORD_LENGTH_MUST_BE_MORE_THAN_8,
  EMAIL_IS_EMPTY,
  EMAIL_IS_IN_WRONG_FORMAT,
} = require("./constant.util");

const generateHashedPassword = (password) => sha256(password);

function generateServerResponse(res, code, description, message, data,location) {
    const fullMessage= {};
    fullMessage[location]= {
        description,
        message,
    }
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

// ================================
// Validation:
// Handle all validation check for the server
// ================================
const registerValidation = [
  check("gmail")
    .exists()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_IN_WRONG_FORMAT),
  check("password")
    .exists()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({ min: 8 })
    .withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
];
const loginValidation = [
  check("gmail")
    .exists()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_IN_WRONG_FORMAT),
  check("password")
    .exists()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({ min: 8 })
    .withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
];

module.exports = {
  registerValidation,
  loginValidation,
  generateHashedPassword,
  generateServerErrorCode,
  generateServerResponse,
};
