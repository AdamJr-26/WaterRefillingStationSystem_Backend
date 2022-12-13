module.exports = (Personel) => {
  return {
    updatePersonelAdminId: async (payload) => {
      try {
        const filter = {
          gmail: payload.gmail,
        };
        const update = {
          $set: { admin: payload.adminId },
        };
        const data = await Personel.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        })
          .select(["gmail admin _id"])
          .exec();
        return { data };
      } catch (error) {
        console.log("errorrr", error);
        return { error };
      }
    },
  };
};
