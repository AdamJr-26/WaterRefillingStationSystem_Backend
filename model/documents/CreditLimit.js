const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const creditLimit = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  customerType: { type: String, default: "regular" },
  creditLimit: { type: Number, required: true },
  creditTermByDays: { type: Number, default: 0 },
}).set("timestamps", true);

creditLimit.plugin(mongoosePaginate);
creditLimit.plugin(aggregatePaginate);

module.exports = creditLimit;
