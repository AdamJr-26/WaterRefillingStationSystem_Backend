const mongoose = require("mongoose");

module.exports = (Gallon, Vehicle) => {
  return {
    getGallons: async ({ adminId, page, limit }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
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
          {
            $sort: {
              _id: -1,
            },
          },
        ];

        const aggregation = Gallon.aggregate(pipeline);
        const data = await Gallon.aggregatePaginate(aggregation, options);
        console.log("data----------->>>", JSON.stringify(data));
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
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(adminId),
            },
          },
          {
            $lookup: {
              from: "deliveries",
              localField: "_id",
              foreignField: "vehicle",
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
              as: "deliveries",
            },
          },
          {
            $addFields: {
              isAvailable: {
                $cond: {
                  if: { $gt: [{ $size: "$deliveries" }, 0] },
                  then: false,
                  else: true,
                },
              },
            },
          },
          {
            $match: {
              isAvailable: true,
            },
          },
        ];
        const data = await Vehicle.aggregate(pipeline);

        return { data };
      } catch (error) {
        return { error };
      }
    },
    getVehicles: async ({ adminId, page, limit }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(adminId),
            },
          },
          {
            $lookup: {
              from: "deliveries",
              localField: "_id",
              foreignField: "vehicle",
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
              as: "deliveries",
            },
          },
          {
            $addFields: {
              isAvailable: {
                $cond: {
                  if: { $gt: [{ $size: "$deliveries" }, 0] },
                  then: false,
                  else: true,
                },
              },
            },
          },
        ];

        const aggregation = Vehicle.aggregate(pipeline);
        const data = await Vehicle.aggregatePaginate(aggregation, options);
        console.log("data----------->>>", JSON.stringify(data));
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
    getAllGallonsNotInProducts: async ({ admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "gallon",
              as: "matched_docs",
            },
          },
          {
            $match: {
              matched_docs: { $size: 0 },
            },
          },
        ];
        const data = await Gallon.aggregate(pipeline);
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
