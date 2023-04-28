const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const expense = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "admin" },
  delivery_personnel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  expense_title: { type: String },
  amount: { type: Number },
  description: { type: String },
  date: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: { type: Date, default: () => new Date() },
  },
});
expense.plugin(mongoosePaginate);
expense.plugin(aggregatePaginate);
module.exports = expense;
