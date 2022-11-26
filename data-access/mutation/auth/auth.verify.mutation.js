module.exports = (Admin, Personel) => {
  return {
    verifyAdmin: async (id) => {
      try {
        const filter = {
          "_id": id,
        };
        const update = {
          "verify": true,
        };
        const admin = await Admin
          .findOneAndUpdate(filter, { $set: update }, { returnOriginal: false })
          .select(["gmail"])
          .exec();
        return { data: admin };
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
