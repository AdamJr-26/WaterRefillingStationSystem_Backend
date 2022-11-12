module.exports = (Personel) => {
  return {
    checkIfPersonelIsExisting: async (payload) => {
      try {
        const filter = {
          gmail: payload.gmail,
        };
        const personel = await Personel.findOne(filter)
          .select(["gmail", "verified"])
          .exec();
        return { personel };
      } catch (personel_error) {
        return { personel_error };
      }
    },
    checkIfPersonelExistingAndVerified: async (payload) => {
      try {
        const filter = {
          gmail: payload.gmail,
          verified: true,
        };
        const personelData = await Personel.findOne(filter)
          .select(["gmail", "verified", "password", "_id"])
          .exec();
        return { personelData };
      } catch (personel_error) {
        return { personel_error };
      }
    },
  };
};
