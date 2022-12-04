const mongoose = require("mongoose");
const delivery = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "admin" },
  delivery_personel: { type: mongoose.Types.ObjectId, ref: "Personel" },
  vehicle: { type: mongoose.Types.ObjectId, ref: "Vehicle" },
  borrowed: [
    new mongoose.Schema({
      borrowed: { type: mongoose.Types.ObjectId, ref: "Borrowed_Gallon" },
    }),
  ],
  credited: [
    new mongoose.Schema({
      credited: { type: mongoose.Types.ObjectId, ref: "Credited_Gallon" },
    }),
  ],
  paid: [
    new mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      total_item: { type: Number },
      price_per_item: { type: Number },
      date: {
        type: Date,
        default: new Date(),
        min: "2021-12-30", 
        max: "2050-12-30",
      },
    }),
  ],
  delivery_items: [
    new mongoose.Schema({
      gallon: { type: mongoose.Types.ObjectId, ref: "Gallon" },
      total: { type: Number },
    }),
  ],
  date_of_creation: { type: Date, default: new Date() },
  date_of_approval: { type: Date },
  approved: { type: Boolean, default: false },
  returned: { type: Boolean, default: false },
});

module.exports = delivery;
