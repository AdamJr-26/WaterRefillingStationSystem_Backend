const mongoose = require("mongoose");
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

        return { data: data[0] };
      } catch (error) {
        return { error };
      }
    },

    getPersonelsByAdminId: async ({ adminId, page, limit }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        // const filter = {
        //   admin: payload.adminId,
        // };
        // const data = await Personel.find(filter)
        //   .select([
        //     "firstname",
        //     "lastname",
        //     "gender",
        //     "contact_number",
        //     "position",
        //     "role",
        //     "status",
        //     "gmail",
        //     "nickname",
        //     "display_photo",
        //   ])
        //   .exec();
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(adminId),
            },
          },
          // check if the personnel has  a delivery
          {
            $lookup: {
              from: "deliveries",
              localField: "_id",
              foreignField: "delivery_personnel",
              pipeline: [
                {
                  $match: {
                    returned: false,
                  },
                },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: "status",
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $project: {
              firstname: 1,
              lastname: 1,
              fullname: {
                $concat: ["$firstname", " ", "$lastname"],
              },
              gender: 1,
              contact_number: 1,
              position: 1,
              role: 1,
              isAvailable: {
                $cond: {
                  if: { $gt: [{ $size: "$status" }, 0] },
                  then: false,
                  else: true,
                },
              },
              gmail: 1,
              nickname: {
                $cond: {
                  if: { $eq: ["$nickname", ""] },
                  then: "N/A",
                  else: "$nickname",
                },
              },
              display_photo: 1,
            },
          },
        ];
        const aggregation = Personel.aggregate(pipeline);
        const data = await Personel.aggregatePaginate(aggregation, options);
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
