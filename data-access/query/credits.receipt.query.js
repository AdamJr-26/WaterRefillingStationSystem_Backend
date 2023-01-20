const mongoose = require("mongoose");
module.exports = (PayCreditReceipt) => {
  return {
    getPayersCredits: async ({ admin, limit, skip, from, to }) => {
      try {
        const match =
          from !== "null" && to !== "null"
            ? {
                $match: {
                  admin: mongoose.Types.ObjectId(admin),
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          "$date.unix_timestamp",
                          Math.floor(new Date(from).valueOf() / 1000),
                        ],
                      },
                      {
                        $lte: [
                          "$date.unix_timestamp",
                          Math.floor(new Date(to).valueOf() / 1000),
                        ],
                      },
                    ],
                  },
                },
              }
            : {
                $match: {
                  admin: mongoose.Types.ObjectId(admin),
                },
              };
        const pipeline = [
          match,
          {
            $sort: { "date.unix_timestamp": -1 },
          },
          {
            $skip: Number(skip),
          },
          {
            $limit: Number(limit),
          },
          {
            $lookup: {
              from: "customers",
              localField: "customer",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    display_photo: 1,
                    firstname: 1,
                    lastname: 1,
                    address: 1,
                    customer_type: 1,
                  },
                },
              ],
              as: "customer",
            },
          },
        ];
        const data = await PayCreditReceipt.aggregate(pipeline);
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
