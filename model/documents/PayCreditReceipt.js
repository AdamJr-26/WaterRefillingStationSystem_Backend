const mongoose = require("mongoose");

const pay_credit_receipt = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
  gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
  personnel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  credit: { type: mongoose.Types.ObjectId, ref: "Credit", index: true },
  amount_paid: { type: Number },
  gallon_count: { type: Number },
  price: { type: Number },
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: {
      type: Date,
       default: () => new Date(), index: true
    },
  },
});

module.exports = pay_credit_receipt;
