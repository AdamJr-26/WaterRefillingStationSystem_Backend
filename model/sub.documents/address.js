const mongoose = require("mongoose")

module.exports = new mongoose.Schema({
    region: { type: String },
    province: { type: String },
    city: { type: String },
    barangay: { type: String },
    street_building_house_no: { type: String },
  })
  