const {
  encryptPassword,
  comparePassword,
} = require("../../utils/password.util");
const mutation = require("../../data-access/mutation/index");
const query = require("../../data-access/query/index");
const { sendEmail, sendOTP } = require("../../utils/email/mailer");
const clientCofing = require("../../config/client.config");
const { validationResult } = require("express-validator");
const signIn = require("../../utils/jwt.sign");
// for register.controller
const responseUtil = require("../../utils/server.responses.util");
const constantUtils = require("../../utils/constant.util");
const crypto = require("crypto");

module.exports = {
  ...require("./checking.gmail")(query, responseUtil),
  ...require("./authorize.controller")(responseUtil),
  ...require("./verify.controller")(mutation, query, responseUtil),
  ...require("./register.controller")(
    mutation,
    sendEmail,
    clientCofing,
    responseUtil,
    constantUtils,
    validationResult,
    encryptPassword,
    sendOTP,
    crypto,
    query,
  ),
  ...require("./login.controller")(
    mutation,
    query,
    sendEmail,
    clientCofing,
    responseUtil,
    constantUtils,
    validationResult,
    comparePassword,
    signIn
  ),
  ...require("./logout.controller")(),
  ...require("./update.controller")(
    mutation,
    query,
    comparePassword,
    encryptPassword,
    responseUtil
  ),
  ...require("./forgot.password/send.otp")(
    mutation,
    query,
    crypto,
    clientCofing,
    responseUtil,
    sendOTP
  ),
  ...require("./forgot.password/verify.otp")(
    query,
    responseUtil,
  ),
  ...require("./forgot.password/send.verify.link")(
    mutation,
    query,
    crypto,
    clientCofing,
    responseUtil,
    sendEmail
  ),
  ...require("./forgot.password/set.new.password")(
    mutation,
    query,
    responseUtil,
    encryptPassword,
    sendOTP,
    crypto
  ),
};
