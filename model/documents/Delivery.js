const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const delivery = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "admin" },
  delivery_personel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  vehicle: { type: mongoose.Types.ObjectId, ref: "Vehicle" },

  delivery_items: [
    new mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      total: { type: Number },
    }),
  ],
  dispatched_items: [
    new mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      total: { type: Number },
    }),
  ],
  selectedRoutes: [
    new mongoose.Schema({
      schedule: { type: mongoose.Types.ObjectId, ref: "Schedule" },
    }),
  ],
  date_of_creation: {
    unix_timestamp: {
      type: Number,
      default: () => Math.floor(new Date().valueOf() / 1000),
    },
    utc_date: { type: Date, default: () => new Date() },
  },
  finished_date: {
    unix_timestamp: {
      type: Number,
    },
    utc_date: { type: Date },
  },
  approved: { type: Boolean, default: false },
  approved_date: { type: Number },
  returned: { type: Boolean, default: false },
  returned_date: { type: Number },
});
delivery.plugin(mongoosePaginate);
delivery.plugin(aggregatePaginate);

module.exports = delivery;
