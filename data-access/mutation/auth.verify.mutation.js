module.exports = (stationModel, Personel) => {
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
        return { data: admin.admin };
      } catch (error) {
        return { error };
      }
    },
    verifyPersonel: async (gmail) => {
      try {
        const filter = {
          gmail: gmail,
        };
        const update = {
          verified: true,
        };
        const personelData = await Personel.findOneAndUpdate(
          filter,
          {
            $set: update,
          },
          { returnOriginal: false }
        ).exec();
        return { personelData };
      } catch (error) {
        return { personelError };
      }
    },
  };
};
