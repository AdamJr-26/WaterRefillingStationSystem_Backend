const mongoose = require("mongoose");
module.exports = (ReturnGallonReceipt, startOfDay, endOfDay) => {
  return {
    getReturnsHistory: async ({ admin, customer, from, to, page, limit }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };

        const match =
          from !== "null" && to !== "null"
            ? {
                $match: {
                  admin: mongoose.Types.ObjectId(admin),
                  customer: mongoose.Types.ObjectId(customer),
                  total_returned: { $gt: 0 },
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          "$date.unix_timestamp",
                          {
                            $floor: {
                              $divide: [
                                startOfDay(new Date(from)).valueOf(),
                                1000,
                              ],
                            },
                          },
                        ],
                      }, 
                      {
                        $lte: [
                          "$date.unix_timestamp",
                          {
                            $floor: {
                              $divide: [endOfDay(new Date(to)).valueOf(), 1000],
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              }
            : {
                $match: {
                  admin: mongoose.Types.ObjectId(admin),
                  customer: mongoose.Types.ObjectId(customer),
                  total_returned: { $gt: 0 },
                },
              };
        const pipeline = [
          match,
        
          {
            $lookup: {
              from: "gallons",
              localField: "gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    gallon_image: 1,
                    liter: 1,
                    name: 1,
                  },
                },
              ],
              as: "gallon",
            },
          },
          {
            $sort: { "date.unix_timestamp": -1 },
          },
        ];

        const aggregation = ReturnGallonReceipt.aggregate(pipeline);
        const data = await ReturnGallonReceipt.aggregatePaginate(
          aggregation,
          options
        );
        console.log("data", data);
        return { data };
      } catch (error) {
        console.log("[error-return-history]", error);
        return { error };
      }
    },
  };
};
