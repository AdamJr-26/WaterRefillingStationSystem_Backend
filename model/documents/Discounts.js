const mongoose = require("mongoose");

const discounts = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  get_free: {
    name: { type: String, default: "get-free" },
    buy: { type: Number },
    get: { type: Number },
  },
});

module.exports = discounts;
