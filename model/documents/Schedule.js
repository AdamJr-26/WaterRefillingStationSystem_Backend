const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  items: [
    new mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      total: { type: Number },
    }),
  ],
  schedule: {
    unix_timestamp: { type: Number, required: true },
    utc_date: { type: Date },
  },
  order_by: { type: String, default: "schedule" },
  assigned: { type: Boolean, default: false },
  assigned_to: { type: mongoose.Types.ObjectId, ref: "Personel" },
  notified: { type: Boolean, default: false },
  accepted: { type: Boolean, default: false },
}).set("timestamps", true);
