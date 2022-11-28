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
        const personelData = await Personel.findOne(filter).exec();
        return { personelData };
      } catch (personel_error) {
        return { personel_error };
      }
    },
    getProfile: async (payload) => {
      try {
        const filter = payload;
        const data = await Personel.findOne(filter)
          .select(["-password"])
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getPersonelsByAdminId: async (payload) => {
      try {
        const filter = {
          admin: payload.adminId,
        };
        const data = await Personel.find(filter)
          .select([
            "firstname",
            "lastname",
            "gender",
            "contact_number",
            "position",
            "role",
            "status",
            "gmail",
            "nickname",
          ])
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
