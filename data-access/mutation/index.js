const { stationModel, OTP, Personel } = require("../../model/index");
module.exports = {
  ...require("./auth.register.mutation")(stationModel, Personel),
  ...require("./auth.verify.mutation")(stationModel, Personel),
  ...require("./auth.update.mutation")(stationModel, Personel),
  ...require("./auth.create.mutation")(OTP),
  ...require("./auth.delete.mutation")(OTP),
};
