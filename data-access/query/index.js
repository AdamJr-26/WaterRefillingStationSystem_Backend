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
  Discount,
  Credit,
  Borrow,
  Purchase,
  PayCreditReceipt,
} = require("../../model/index");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");

module.exports = {
  ...require("./admin.query")(Admin),
  ...require("./inventory.query")(Gallon, Vehicle),
  ...require("./otp.query")(OTP),
  ...require("./personel.query")(Personel),
  ...require("./address.query")(Address),
  ...require("./delivery.query")(Delivery, Purchase, endOfDay, startOfDay),
  ...require("./customer.query")(Customer),
  ...require("./schedule.query")(Schedule, endOfDay, startOfDay),
  ...require("./discount.query")(Discount),
  ...require("./credits.query")(Credit),
  ...require("./borrow.query")(Borrow),
  ...require("./purchase.query")(Purchase),
  ...require("./credits.receipt.query")(PayCreditReceipt),
};
