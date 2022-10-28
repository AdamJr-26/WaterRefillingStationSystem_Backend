module.exports = (stationModel) => {
  return {
    verifyAdmin: async (id) => {
      try {
        const filter = {
          "admin._id": id,
        };
        const update = {
          "admin.verify": true,
        };
        const admin = await stationModel
          .findOneAndUpdate(filter, { $set: update }, { returnOriginal: false })
          .select(["admin"])
          .exec();
        return { data: admin.admin};
      } catch (error) {
        return { error };
      }
    },
  };
};
