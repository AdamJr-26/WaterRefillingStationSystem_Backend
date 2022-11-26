module.exports = (Admin, Personel) => {
  return {
    updateAdminPassword: async (payload) => {
      try {
        const filter = {
          "gmail": payload.gmail,
        };
        const update = {
          "password": payload.hashed_password,
        };
        const admin = await Admin
          .findOneAndUpdate(filter, { $set: update }, { returnOriginal: false })
          .exec();
        return { data: admin };
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
