const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const personnel = mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  gmail: { type: String, require: true },
  nickname: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  gender: { type: String },
  age: { type: String },
  contact_number: { type: String },
  address: { type: String },
  position: { type: String, default: "Delivery Personnel" },
  password: { type: String },
  agreedToPrivacyAndPolicy: { type: Boolean },
  verified: { type: Boolean, default: false },
  role: { type: String, default: "Personnel" },
  applyId: { type: String },
  apply_date: { type: Date },
  on_delivery: { type: Boolean, default: false },
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
personnel.plugin(mongoosePaginate);
personnel.plugin(aggregatePaginate);
module.exports = personnel;
