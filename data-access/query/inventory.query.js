const mongoose = require("mongoose");

module.exports = (Gallon, Vehicle) => {
  return {
    getGallons: async ({ adminId }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(adminId),
            },
          },
          {
            $lookup: {
              from: "borrows",
              localField: "_id",
              foreignField: "gallon",
              pipeline: [
                {
                  $match: {
                    total: { $gt: 0 },
                  },
                },
                {
                  $project: {
                    total: 1,
                    gallon: 1,
                  },
                },
                {
                  $group: {
                    _id: "$gallon",
                    total_borrowed: {
                      $sum: { $sum: "$total" },
                    },
                  },
                },
              ],
              as: "borrowed",
            },
          },

          // {
          //   $group: {
          //     id: "$_id",
          //   },
          // },
        ];
        const data = await Gallon.aggregate(pipeline);
        
        return { data };
      } catch (error) {
        console.log("error", error);
        return { error };
      }
    },
    getAvailableGallons: async ({ adminId }) => {
      try {
        const filter = {
          admin: adminId,
          total: { $gt: 0 },
        };
        const data = await Gallon.find(filter).select(["-borrowed"]).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getGallon: async ({ admin, id }) => {
      try {
        const filter = {
          admin: admin,
          _id: id,
        };
        const data = await Gallon.findOne(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAvailableVehicles: async ({ adminId }) => {
      try {
        const filter = {
          admin: adminId,
          available: true,
        };
        const data = await Vehicle.find(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getVehicles: async ({ adminId }) => {
      try {
        const filter = {
          admin: adminId,
        };
        const data = await Vehicle.find(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    checkIfAllGallonsAreAvailable: async ({
      // not used/ still have bug
      admin,
      ArrayOfId,
      selected,
      ArrayOfTotal,
    }) => {
      try {

        const filter = {
          admin: admin,
          _id: ArrayOfId,
          total: { $gte: ArrayOfTotal },
        };

        const data = await Gallon.find(filter).select(selected).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
