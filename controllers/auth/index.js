
const {encryptPassword} = require("../../utils/password.util");
const mutation = require("../../data-access/mutation/index");
const query = require("../../data-access/query/index");
const { sendEmail } = require("../../utils/email/mailer");
const clientCofing = require("../../config/client.config");

module.exports = {
    ...require("./register.admin")(mutation, sendEmail,clientCofing,encryptPassword),
    ...require("./verify.admin")(mutation),
    ...require("./checking.gmail")(query)
}