const {
  Admin,
  OTP,
  Personel,
  Address,
  Gallon,
  Vehicle,
  Delivery,
  Customer,
  Schedule,
} = require("../../model/index");
const db = require("../../db/conn");
const { uploadImage } = require("../../utils/file.cloud.uploader.util");
module.exports = {
  ...require("./accept.delivery.transaction")(
    db,
    Delivery,
    Gallon,
    Vehicle,
    Personel
  ),
  ...require("./create.customer.transaction")(db, Customer, uploadImage),
  ...require("./schedule.transaction")(db, Schedule),
};
