module.exports = (Personel) => {
  return {
    checkIfPersonelIsExisting: async (payload) => {
      try {
        const filter = {
          gmail: payload.gmail,
        };
        const personel = await Personel.findOne(filter).exec();
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
        const pipeline = [
          {
            $match: {
              _id: payload?.userId,
              gmail: payload?.gmail,
            },
          },
          // issue: information ng admin at wrs ay magkasama, pwedeng mafetch pati admin info like password.
          {
            $lookup: {
              from: "admins",
              localField: "admin",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    address: 1,
                    wrs_name: 1,
                    dispay_photo: 1,
                  },
                },
              ],
              as: "adminInfo",
            },
          },
          {
            $project: {
              password: 0,
              cloudinary: 0,
              createdAt: 0,
              updatedAt: 0,
              status: 0,
              verified: 0,
            },
          },
        ];
        const data = await Personel.aggregate(pipeline);
        console.log("datadatadata", JSON.stringify(data));
        return { data: data[0] };
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
            "display_photo",
          ])
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    
  };
};
