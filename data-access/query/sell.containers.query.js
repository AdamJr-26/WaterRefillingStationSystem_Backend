const mongoose = require("mongoose");
module.exports = (SoldContainer, startOfMonth, endOfMonth) => {
  return {
    getSoldContainers: async ({ admin, page, limit, date }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              $expr: {
                $and: [
                  {
                    $gte: [
                      "$date.unix_timestamp",
                      Math.floor(startOfMonth(new Date(date)).valueOf() / 1000),
                    ],
                  },
                  {
                    $lte: [
                      "$date.unix_timestamp",
                      Math.floor(endOfMonth(new Date(date)).valueOf() / 1000),
                    ],
                  },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "customers",
              localField: "customer",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    fullname: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                  },
                },
              ],
              as: "customer",
            },
          },

          {
            $lookup: {
              from: "gallons",
              localField: "gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    liter: 1,
                    gallon_image: 1,
                  },
                },
              ],
              as: "gallon",
            },
          },
          {
            $unwind: "$customer",
          },
          {
            $unwind: "$gallon",
          },
        ];
        const aggregation = SoldContainer.aggregate(pipeline);
        const data = await SoldContainer.aggregatePaginate(
          aggregation,
          options
        );
        
        return data;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
  };
};
