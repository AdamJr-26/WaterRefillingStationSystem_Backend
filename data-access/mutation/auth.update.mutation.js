module.exports = (stationModel) => {
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
  };
};
