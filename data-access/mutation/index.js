const { Admin, Gallon,OTP, Personel, Vehicle } = require("../../model/index");
const db = require("../../db/conn");
module.exports = {
  ...require("./auth/auth.register.mutation")(Admin, Personel),
  ...require("./auth/auth.verify.mutation")(Admin, Personel),
  ...require("./auth/auth.update.mutation")(Admin, Personel),
  ...require("./auth/auth.create.mutation")(OTP),
  ...require("./auth/auth.delete.mutation")(OTP),
  ...require("./admin/inventory.mutation")(Gallon, Vehicle),
};
