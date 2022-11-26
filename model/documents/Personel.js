const mongoose = require("mongoose");

module.exports = mongoose.Schema({
  admin: {type:mongoose.Types.ObjectId, ref: "admin"},
  gmail: { type: String, require: true },
  nickname: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  gender: { type: String },
  age: { type: String },
  contact_number: { type: String },
  address: { type: String },
  position: { type: String, default: "Delivery Personel" },
  password: { type: String },
  agreedToPrivacyAndPolicy: { type: Boolean },
  verified: { type: Boolean, default: false },
  role: {type: String,default: "Personel"}
}).set("timestamps", true)
