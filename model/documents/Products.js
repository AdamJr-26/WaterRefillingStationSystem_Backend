const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
  gallon: { type: mongoose.Types.ObjectId, ref: "Gallon", required: true },
  price: { type: Number },
});
