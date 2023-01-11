const mongoose = require("mongoose");

module.exports = mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
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
  role: { type: String, default: "Personel" },
  applyId: { type: String },
  apply_date: { type: Date },
  status: { type: String, default: "available" },
  display_photo: {
    type: String,
    default:
      "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png",
  },
  date_created: {
    type: Number,
    default: () => Math.floor(new Date().valueOf() / 1000),
  },
  cloudinary: {
    userFolder: { type: String },
    publicId: { type: String },
    url: { type: String },
    mimetype: { type: String },
  },
});
