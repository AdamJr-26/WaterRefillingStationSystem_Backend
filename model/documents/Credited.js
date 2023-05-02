const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const credited_gallon = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  personel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
  delivery: { type: mongoose.Types.ObjectId, ref: "Delivery" },
  gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
  total: { type: Number },
  price: { type: Number },
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: { type: Date, default: () => new Date() },
  },
});
credited_gallon.plugin(mongoosePaginate);
credited_gallon.plugin(aggregatePaginate);
module.exports = credited_gallon;
