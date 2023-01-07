const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  customer_type: { type: String, default: "regular" },
  account_provided_by: { type: String },
  display_photo: {
    type: String,
    default:
      "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png",
  },
  cloudinary: {
    userFolder: { type: String },
    publicId: { type: String },
    url: { type: String },
    mimetype: { type: String },
  },
  firstname: { type: String, required: true, index: true },
  lastname: { type: String, index: true },
  gender: { type: String },
  mobile_number: { type: String, index: true },
  address: {
    province: { type: String },
    municipal_city: { type: String, index: true },
    barangay: { type: String, index: true },
    street: { type: String, index: true },
  },
  gmail: { type: String },
  password: { type: String },
  date_created: {
    type: Number,
    default: () => Math.floor(new Date().valueOf() / 1000),
  },

  last_delivery: { type: Date },
  uncovered_discount: [
    mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      count: { type: Number },
    }),
  ],
});
