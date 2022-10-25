const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
module.exports = new mongoose.Schema({
  wrs_name: { type: String },
  gmail: { type: String },
  contact_number: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  gender: { type: String },
  age: { type: String },
  password: { type: String },
  verify: {type:String, default: false},
  geolocation: {
    lat:{type: String},
    lng:{type: String},
  },
  address: {
    region: { type: String },
    province: { type: String },
    city: { type: String },
    barangay: { type: String },
    street_building_house_no: { type: String },
  },
}).plugin(passportLocalMongoose)
//  validation
