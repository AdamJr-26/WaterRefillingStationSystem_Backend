const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const soldContainer = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
  customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  orderTotal: { type: Number, required: true },
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: { type: Date, default: () => new Date() },
  },
});
soldContainer.plugin(mongoosePaginate);
soldContainer.plugin(aggregatePaginate);

module.exports = soldContainer;