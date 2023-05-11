const mongoose = require("mongoose");

const discounts = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  get_free: {
    name: { type: String, default: "get-free" },
    buy: { type: Number },
    get: { type: Number },
    validityPeriod: { type: Date },
    isAccumulated: { type: Boolean, default: false },
  },
  date_created: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
      index: true,
    },
    utc_date: { type: Date, default: () => new Date(), index: true },
  },
});

module.exports = discounts;
