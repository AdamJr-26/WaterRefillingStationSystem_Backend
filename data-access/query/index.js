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
  ReturnGallonReceipt,
  Products,
  Cart,
  Expense,
  Controls,
  SoldContainer,
} = require("../../model/index");

const { startOfMonth, endOfMonth, startOfDay, endOfDay } = require("date-fns");

module.exports = {
  ...require("./admin.query")(Admin),
  ...require("./inventory.query")(Gallon, Vehicle),
  ...require("./otp.query")(OTP),
  ...require("./personnel.query")(Personel),
  ...require("./address.query")(Address),
  ...require("./delivery.query")(Delivery, Purchase, endOfDay, startOfDay),
  ...require("./customer.query")(Customer),
  ...require("./schedule.query")(Schedule, endOfDay, startOfDay),
  ...require("./discount.query")(Discount),
  ...require("./credits.query")(Credit),
  ...require("./borrow.query")(Borrow),
  ...require("./purchase.query")(Purchase, startOfMonth, endOfMonth),
  ...require("./credits.receipt.query")(
    PayCreditReceipt,
    startOfMonth,
    endOfMonth
  ),
  ...require("./reports.query")(
    Admin,
    Purchase,
    PayCreditReceipt,
    startOfMonth,
    endOfMonth
  ),
  ...require("./statistics/personnel.query")(
    Personel,
    startOfMonth,
    endOfMonth
  ),
  ...require("./statistics/todays.transactions.query")(
    Admin,
    startOfDay,
    endOfDay
  ),
  ...require("./returns.query")(ReturnGallonReceipt, startOfDay, endOfDay),
  ...require("./delivery.details.lookup")(Schedule),
  ...require("./station.query")(Admin),
  ...require("./products.query")(Products),
  ...require("./cart.query")(Cart, Customer),
  ...require("./expenses.query")(Expense, startOfMonth, endOfMonth),
  ...require("./controls.query")(Controls),
  ...require("./sell.containers.query")(
    SoldContainer,
    startOfMonth,
    endOfMonth
  ),
};
