const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const controls = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  autoAcceptDelivery: { type: Boolean, default: false },
  autoAcceptSchedules: { type: Boolean, default: false },
});

controls.plugin(mongoosePaginate);
controls.plugin(aggregatePaginate);
module.exports = controls;
