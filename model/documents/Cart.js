const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
  gallon: { type: mongoose.Types.ObjectId, ref: "Gallon", required: true },
  customer: { type: mongoose.Types.ObjectId, ref: "Customer", required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5000,
  },
}).set("timestamps", true);
