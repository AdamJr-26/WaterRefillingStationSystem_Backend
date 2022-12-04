const {
  Admin,
  OTP,
  Personel,
  Address,
  Gallon,
  Vehicle,
  Delivery,
} = require("../../model/index");
const db = require("../../db/conn");

module.exports = {
  ...require("./accept.delivery.transaction")(
    db,
    Delivery,
    Gallon,
    Vehicle,
    Personel
  ),
};
