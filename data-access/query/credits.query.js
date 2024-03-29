const mongoose = require("mongoose");
module.exports = (Credit) => {
  return {
    getTotalDebt: async ({ admin, customer }) => {
      try {
        const payCreditsPipelines = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              customer: mongoose.Types.ObjectId(customer),
            },
          },
          {
            $group: {
              _id: "$customer",
              total_debt: { $sum: { $multiply: ["$price", "$total"] } },
            },
          },
        ];
        const data = await Credit.aggregate(payCreditsPipelines);

        return { data };
      } catch (error) {
        return { error };
      }
    },
    getCustomerCredits: async ({ customer_id, admin_id }) => {
      try {
        const filter = {
          customer: customer_id,
          admin: admin_id,
          total: { $gt: 0 },
        };
        const data = await Credit.find(filter)
          .populate([
            {
              path: "gallon",
              model: "Gallon",
              select: "name liter gallon_image",
            },
          ])
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAllCreditsAccountReceivable: async ({ admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              total: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: "$admin",
              account_receivable: {
                $sum: { $sum: { $multiply: ["$price", "$total"] } },
              },
              total_items: {
                $sum: { $sum: "$total" },
              },
              credits_to_settle: { $sum: 1 },
            },
          },
        ];
        const data = await Credit.aggregate(pipeline);
        return { data };
      } catch (error) {
        
        return { error };
      }
    },
    getCreditsByPaginationAndDate: async ({ admin, limit, skip, from, to }) => {
      try {
        const match =
          from !== "null" && to !== "null"
            ? {
                $match: {
                  admin: mongoose.Types.ObjectId(admin),
                  total: { $gt: 0 },
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
                  total: { $gt: 0 },
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
              as: "customer_info",
            },
          },
        ];
        const data = await Credit.aggregate(pipeline);
        return { data };
      } catch (error) {
        console.log("errorerror", error);
        return { error };
      }
    },
    getCreditInfo: async ({ customer_id, admin, credit_id }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              customer: mongoose.Types.ObjectId(customer_id),
              _id: mongoose.Types.ObjectId(credit_id),
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
                    gallon_image: 1,
                    name: 1,
                    liter: 1,
                  },
                },
              ],
              as: "gallon",
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
                    address: 1,
                  },
                },
              ],
              as: "customer",
            },
          },
          {
            $project: {
              date: 0,
              delivery: 0,
              admin: 0,
            },
          },
        ];
        const data = await Credit.aggregate(pipeline);
        console.log("credit info", data);
        return { data };
      } catch (error) {
        console.log("error", error);
        return { error };
      }
    },
  };
};
