const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const return_gallon_receipt = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
  borrow: { type: mongoose.Types.ObjectId, ref: "Borrow" },
  gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
  total_returned: { type: Number },
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
      index: true,
    },
    utc_date: { type: Date, default: () => new Date(), index: true },
  },
});
return_gallon_receipt.plugin(mongoosePaginate);
return_gallon_receipt.plugin(aggregatePaginate);

module.exports = return_gallon_receipt;
