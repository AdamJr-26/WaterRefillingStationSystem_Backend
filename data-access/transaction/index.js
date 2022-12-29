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
  Borrow,
  Credit,
  Purchase,
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
  ...require("./deliver.order.transaction")(
    db,
    Delivery,
    Borrow,
    Credit,
    Purchase,
    Gallon,
    Schedule
  ),
};
