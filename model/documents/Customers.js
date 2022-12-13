const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  customer_type: { type: String },
  account_provided_by: { type: String },
  display_photo: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  gender: { type: String },
  last_delivery: { type: Date },
  mobile_number: { type: String },
  address: {
    province: { type: String },
    municipal_city: { type: String },
    barangay: { type: String },
    street: { type: String },
  },
  gmail: { type: String },
  password: { type: String },
  date_created: {
    type: Date,
    default: () => Math.floor(new Date().valueOf() / 1000),
  },
});
