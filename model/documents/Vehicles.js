const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const vehicles = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  vehicle_name: { type: String },
  vehicle_id: { type: String },
  available: { type: Boolean, default: true },
  vehicle_image: { type: String },
  cloudinary: {
    userFolder: { type: String },
    publicId: { type: String },
    url: { type: String },
    mimetype: { type: String },
  },
}).set("timestamps", true);
vehicles.plugin(mongoosePaginate);
vehicles.plugin(aggregatePaginate);

module.exports = vehicles;
