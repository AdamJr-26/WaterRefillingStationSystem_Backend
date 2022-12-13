const { Admin, Gallon, OTP, Personel, Vehicle,Delivery } = require("../../model/index");
const db = require("../../db/conn");
module.exports = {
  ...require("./auth/auth.register.mutation")(Admin, Personel),
  ...require("./auth/auth.verify.mutation")(Admin, Personel),
  ...require("./auth/auth.update.mutation")(Admin, Personel),
  ...require("./auth/auth.create.mutation")(OTP),
  ...require("./auth/auth.delete.mutation")(OTP),
  ...require("./gallon.vehicle/inventory.mutation")(Gallon, Vehicle),
  ...require("./otp/admin.create.applyid.mutation")(OTP),
  ...require("./personel/update.personel.info.mutation")(Personel, Admin, db),
  ...require("./delivery/delivery.mutation")(Delivery,Gallon, db),
};
