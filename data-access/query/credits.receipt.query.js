const mongoose = require("mongoose");
module.exports = (PayCreditReceipt, startOfMonth, endOfMonth) => {
  return {
    getPayersCredits: async ({ admin, limit, page, from, to }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
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
        const aggregation = PayCreditReceipt.aggregate(pipeline);
        const data = await PayCreditReceipt.aggregatePaginate(
          aggregation,
          options
        );
        console.log("data=>>>>>>",data)
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
      page,
      limit,
    }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
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
            $sort: { "date.unix_timestamp": -1 },
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
        const aggregation = PayCreditReceipt.aggregate(pipeline);
        const data = await PayCreditReceipt.aggregatePaginate(
          aggregation,
          options
        );
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getDebtPayments: async ({ page, limit, date, admin }) => {
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
                    firstname: 1,
                    lastname: 1,
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
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "gallon",
            },
          },
          {
            $project: {
              _id: 1,
              date: 1,
              credit: 1,
              customer: { $arrayElemAt: ["$customer", 0] },
              gallon: { $arrayElemAt: ["$gallon", 0] },
              quantity: "$gallon_count",
              payment: "$amount_paid",
            },
          },
          {
            $sort: {
              "date.unix_timestamp": -1,
            },
          },
        ];
        const aggregation = PayCreditReceipt.aggregate(pipeline);
        const data = await PayCreditReceipt.aggregatePaginate(
          aggregation,
          options
        );
        console.log("data", JSON.stringify(data));
        return data;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
  };
};
