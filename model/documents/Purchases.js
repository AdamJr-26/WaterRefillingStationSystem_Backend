const mongoose = require("mongoose");

const purchase = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  personel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
  delivery: { type: mongoose.Types.ObjectId, ref: "Delivery" },
  items: [
    new mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      orders: { type: Number },
      free: { type: Number },
      price: { type: Number },
      return: { type: Number },
      borrow: { type: Number },
      credit: { type: Number },
    }),
  ],
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: { type: Date, default: () => new Date() },
  },
  total_payment: { type: Number },
  order_to_pay: { type: Number },
  debt_payment: { type: Number },
});
module.exports = purchase;
