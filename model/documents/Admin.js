const mongoose = require("mongoose");
const admin = new mongoose.Schema({
  role: { type: String, default: "Admin" },
  wrs_name: { type: String },
  gmail: { type: String },
  contact_number: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  gender: { type: String },
  age: { type: String },
  password: { type: String },
  verify: { type: Boolean, default: false },
  address:{
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
});
admin.set("timestamps", true)
module.exports = admin;
