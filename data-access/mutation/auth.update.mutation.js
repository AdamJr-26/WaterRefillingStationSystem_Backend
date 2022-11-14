module.exports = (stationModel, Personel) => {
  return {
    updateAdminPassword: async (payload) => {
      try {
        const filter = {
          "admin.gmail": payload.gmail,
        };
        const update = {
          "admin.password": payload.hashed_password,
        };
        const admin = await stationModel
          .findOneAndUpdate(filter, { $set: update }, { returnOriginal: false })
          .select(["admin"])
          .exec();
        return { data: admin.admin };
      } catch (error) {
        return { error };
      }
    },
    updatePersonelPassword: async (payload) => {
      try {
        const filter = {
          gmail: payload.gmail,
        };
        const update = {
          password: payload.hashed_password,
        };
        const personel = await Personel.findOneAndUpdate(
          filter,
          { $set: update },
          { returnOriginal: false }
        )
          .select(["gmail"])
          .exec();
        return { personel };
      } catch (error) {
        return { error };
      }
    },
  };
};
