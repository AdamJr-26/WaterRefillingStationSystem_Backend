const { check } = require("express-validator");

const {
  PASSWORD_IS_EMPTY,
  PASSWORD_LENGTH_MUST_BE_MORE_THAN_8,
  EMAIL_IS_EMPTY,
  EMAIL_IS_IN_WRONG_FORMAT,
} = require("./constant.util");

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

  module.exports ={
    loginValidation,
    registerValidation
  }