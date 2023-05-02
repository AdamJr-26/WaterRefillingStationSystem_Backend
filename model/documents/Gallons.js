const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const gallon = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  gallon_image: { type: String },
  name: { type: String },
  liter: { type: Number },
  price: { type: Number },
  total: { type: Number },
  cloudinary: {
    userFolder: { type: String },
    publicId: { type: String },
    url: { type: String },
    mimetype: { type: String },
  },
});
gallon.plugin(mongoosePaginate);
gallon.plugin(aggregatePaginate);
module.exports = gallon;
