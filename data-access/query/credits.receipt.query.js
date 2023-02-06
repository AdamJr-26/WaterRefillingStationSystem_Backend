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
    getCreditsReceiptsByCustomer: async ({
      admin,
      customer,
      from,
      to,
      skip,
      limit,
    }) => {
      try {
        const match =
          from !== "null" && to !== "null"
            ? {
                $match: {
                  admin: mongoose.Types.ObjectId(admin),
                  customer: mongoose.Types.ObjectId(customer),
                  gallon_count: { $gt: 0 },
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
                  customer: mongoose.Types.ObjectId(customer),
                  gallon_count: { $gt: 0 },
                },
              };

        const pipeline = [
          match,
          {
            $sort: { "date.unix_timestamp": 1 },
          },
          {
            $skip: Number(skip),
          },
          {
            $limit: Number(limit),
          },
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
        ];
        const data = await PayCreditReceipt.aggregate(pipeline);
        console.log("[data-credits-receipts-history]", data);
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
