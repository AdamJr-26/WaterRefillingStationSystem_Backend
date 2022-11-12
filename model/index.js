const db = require("../db/conn");

const station_schema = require("./documents/stations.schema");
const otpSchema = require("./documents/otp.schema");
const delivery_personel = require("./documents/Personel");

const stationModel = db.model("Station", station_schema);
const OTP = db.model("otp", otpSchema);
const Personel = db.model("Personel", delivery_personel);
module.exports = {
  stationModel,
  OTP,
  Personel,
};
