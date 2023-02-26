const mongoose = require("mongoose");
const admin = new mongoose.Schema({
  role: { type: String, default: "Admin" },
  wrs_image: { type: String },
  wrs_name: { type: String },
  gmail: { type: String, unique: true },
  contact_number: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  gender: { type: String },
  birthday: { type: Date },
  password: { type: String },
  verify: { type: Boolean, default: false },
  address: {
    region: { type: String },
    province: { type: String },
    city: { type: String },
    barangay: { type: String },
    street_building: { type: String },
  },
  geolocation: {
    lat: { type: String },
    lng: { type: String },
  },
  date_created: {
    type: Date,
    default: () => Math.floor(new Date().valueOf() / 1000),
  },
});
admin.set("timestamps", true);
module.exports = admin;
