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
    updatePersonelProfilePicture: async ({
      personel_id,
      display_photo,
      cloudinary,
    }) => {
      try {
        const data = await Personel.findOneAndUpdate(
          {
            _id: personel_id,
          },
          {
            $set: { display_photo: display_photo },
          }
        ).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
