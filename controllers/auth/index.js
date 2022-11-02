const {
  encryptPassword,
  comparePassword,
} = require("../../utils/password.util");
const mutation = require("../../data-access/mutation/index");
const query = require("../../data-access/query/index");
const { sendEmail } = require("../../utils/email/mailer");
const clientCofing = require("../../config/client.config");
const { validationResult } = require("express-validator");
const signIn = require("../../utils/jwt.sign");
// for register.controller
const responseUtil = require("../../utils/server.responses.util");
const constantUtils = require("../../utils/constant.util");

module.exports = {
  ...require("./checking.gmail")(query, responseUtil),
  ...require("./register.controller")(
    mutation,
    sendEmail,
    clientCofing,
    encryptPassword
  ),
  ...require("./verify.controller")(mutation, query, responseUtil),
  ...require("./register.controller")(
    mutation,
    sendEmail,
    clientCofing,
    responseUtil,
    constantUtils,
    validationResult,
    encryptPassword
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
    responseUtil,
  ),
};
