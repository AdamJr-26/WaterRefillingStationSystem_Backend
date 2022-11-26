const db = require("../db/conn");

const otpSchema = require("./documents/Otp");
const delivery_personel = require("./documents/Personel");
const admin = require("./documents/Admin");
const gallon = require("./documents/Gallons")
const vehicle = require("./documents/Vehicles")

const Gallon = db.model("Gallon", gallon)
const Vehicle = db.model("Vehicle", vehicle)

const OTP = db.model("otp", otpSchema);
const Personel = db.model("Personel", delivery_personel);
const Admin = db.model("Admin", admin);

module.exports = {
  OTP,
  Personel,
  Admin,
  Gallon,
  Vehicle,
};

