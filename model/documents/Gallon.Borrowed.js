const mongoose = require("mongoose");
const borrowed_gallon = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "admin" },
  delivery_personel_id: { type: mongoose.Types.ObjectId, ref: "Personel" },
  vehicle_id: { type: mongoose.Types.ObjectId, ref: "Vehicle" },
  gallon_id: { type: mongoose.Types.ObjectId, ref: "Gallon" },
  customer_id: { type: mongoose.Types.ObjectId, ref: "Customer" },
  total_item: { type: Number },
  price_per_item: { type: Number },
  date: {
    type: Date,
    default: () => Math.floor(new Date().valueOf() / 1000),
    min: "2021-12-30", // currrent date?
    max: "2050-12-30",
  },
});

module.exports = borrowed_gallon;
