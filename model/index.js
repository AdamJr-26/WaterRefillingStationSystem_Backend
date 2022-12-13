const db = require("../db/conn");

const otpSchema = require("./documents/Otp");
const delivery_personel = require("./documents/Personel");
const admin = require("./documents/Admin");
const gallon = require("./documents/Gallons");
const vehicle = require("./documents/Vehicles");
const delivery = require("./documents/Delivery");
const customer = require("./documents/Customers");
const gallon_borrowed = require("./documents/Gallon.Borrowed");
const gallon_credited = require("./documents/Gallon.Credited")

const Gallon = db.model("Gallon", gallon);
const Vehicle = db.model("Vehicle", vehicle);
const OTP = db.model("otp", otpSchema);
const Personel = db.model("Personel", delivery_personel);
const Admin = db.model("Admin", admin);
const Customer = db.model("Customer", customer);
const Delivery = db.model("Delivery", delivery);
const BorrowedGallon = db.model("BorrowedGallon", gallon_borrowed);
const CreditedGallon = db.model("CreditedGallon", gallon_credited)
module.exports = {
  OTP,
  Personel,
  Admin,
  Gallon,
  Vehicle,
  Delivery,
  Customer,
  BorrowedGallon,
  CreditedGallon,
};
