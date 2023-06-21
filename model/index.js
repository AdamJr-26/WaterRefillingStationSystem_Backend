const db = require("../db/conn");

const otpSchema = require("./documents/Otp");
const delivery_personel = require("./documents/Personel");
const admin = require("./documents/Admin");
const gallon = require("./documents/Gallons");
const vehicle = require("./documents/Vehicles");
const delivery = require("./documents/Delivery");
const customer = require("./documents/Customers");
const gallon_borrowed = require("./documents/Borrowed");
const gallon_credited = require("./documents/Credited");
const schedule = require("./documents/Schedule");
const discount = require("./documents/Discounts");
const purchase = require("./documents/Purchases");
const pay_credit_receipt = require("./documents/PayCreditReceipt.js");
const return_gallon_receipt = require("./documents/ReturnGallonReceipt");
const expense = require("./documents/Expenses");
const products = require("./documents/Products");
const cart = require("./documents/Cart");
const controls = require("./documents/Controls");
const soldContainer = require("./documents/SoldContainer");
const creditLimit = require("./documents/CreditLimit");
// model
const Gallon = db.model("Gallon", gallon);
const Vehicle = db.model("Vehicle", vehicle);
const OTP = db.model("otp", otpSchema);
const Personel = db.model("Personel", delivery_personel);
const Admin = db.model("Admin", admin);
const Customer = db.model("Customer", customer);
const Delivery = db.model("Delivery", delivery);
const Borrow = db.model("Borrow", gallon_borrowed);
const Credit = db.model("Credit", gallon_credited);
const Schedule = db.model("Schedule", schedule);
const Discount = db.model("Discount", discount);
const Purchase = db.model("Purchase", purchase);
const PayCreditReceipt = db.model("PayCreditReceipt", pay_credit_receipt);
const ReturnGallonReceipt = db.model(
  "ReturnGallonReceipt",
  return_gallon_receipt
);
const Expense = db.model("Expense", expense);
const Products = db.model("Product", products);
const Cart = db.model("Cart", cart);
const Controls = db.model("Control", controls);
const SoldContainer = db.model("SoldContainer", soldContainer);
const CreditLimit = db.model("creditLimit", creditLimit);
module.exports = {
  OTP,
  Personel,
  Admin,
  Gallon,
  Vehicle,
  Delivery,
  Customer,
  Borrow,
  Credit,
  Schedule,
  Discount,
  Purchase,
  PayCreditReceipt,
  ReturnGallonReceipt,
  Expense,
  Products,
  Cart,
  Controls,
  SoldContainer,
  CreditLimit,
};
