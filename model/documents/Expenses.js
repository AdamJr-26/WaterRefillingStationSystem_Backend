const mongoose = require("mongoose");

const expense = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "admin" },
  delivery_personel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  expense_name: { type: String },
  amount: { type: Number },
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: { type: Date, default: () => new Date() },
  },
});

module.exports = expense;
