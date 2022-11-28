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
        const data = await Personel.findOneAndUpdate(filter, update)
          .select(["-password"])
          .exec();
        return { data };
      } catch (error) {
        console.log("error",error)
        return { error };
      }
    },
  };
};
