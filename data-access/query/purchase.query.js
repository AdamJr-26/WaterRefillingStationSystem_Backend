const mongoose = require("mongoose");
module.exports = (Purchase, startOfMonth, endOfMonth) => {
  return {
    getSummaryOfDeliveryFromPurchases: async ({ delivery_id, admin }) => {
      try {
        const stages = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              delivery: mongoose.Types.ObjectId(delivery_id),
            },
          },
          {
            $group: {
              _id: "$delivery",
              total_orders: {
                $sum: { $sum: "$items.orders" },
              },
              total_free: {
                $sum: { $sum: "$items.free" },
              },
              total_returned_gallon: {
                $sum: { $sum: "$items.return" },
              },
              total_borrowed_gallon: {
                $sum: { $sum: "$items.borrow" },
              },
              total_credited_gallon: {
                $sum: { $sum: "$items.credit" },
              },
              total_of_all_debt_payment: {
                $sum: "$debt_payment",
              },
              total_of_all_payment: {
                $sum: "$total_payment",
              },
              total_of_all_order_to_pay: {
                $sum: "$order_to_pay",
              },
            },
          },
        ];

        const data = await Purchase.aggregate(stages);

        return { data };
      } catch (error) {
        return { error };
      }
    },
    getPurchasesHistoryByCustomerId: async ({
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
              localField: "items.gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    gallon_image: 1,
                  },
                },
              ],
              as: "gallons",
            },
          },
          {
            $project: {
              items: 1,
              total_orders: {
                $sum: "$items.orders",
              },
              gallons: 1,
              total_payment: 1,
              order_to_pay: 1,
              debt_payment: 1,
              date: 1,
            },
          },
        ];
        // const data = await Purchase.aggregate(pipeline);
        const aggregation = Purchase.aggregate(pipeline);
        const data = await Purchase.aggregatePaginate(aggregation, options);
        return { data };
      } catch (error) {
        console.log("[data-purchase-history]", error);
        return { error };
      }
    },
    getPurchasesPaginate: async ({ page, limit, date, admin }) => {
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
            $unwind: "$items",
          },
          {
            $group: {
              _id: "$_id",
              customer: { $first: "$customer" },
              date: { $first: "$date" },
              totalOrders: {
                $sum: {
                  $sum: ["$items.orders", "$items.free"],
                },
              },
              paid_orders: {
                $sum: {
                  $subtract: [
                    { $sum: "$items.orders" },
                    { $sum: "$items.credit" },
                  ],
                },
              },
              credited_orders: {
                $sum: {
                  $sum: "$items.credit",
                },
              },
              free: {
                $sum: {
                  $sum: "$items.free",
                },
              },
              price: {
                $sum: {
                  $multiply: ["$items.orders", "$items.price"],
                },
              },
              payment: {
                $first: "$order_to_pay",
              },
            },
          },
          {
            $project: {
              customer: { $arrayElemAt: ["$customer", 0] },
              date: 1,
              totalOrders: 1,
              paid_orders: 1,
              credited_orders: 1,
              free: 1,
              price: 1,
              payment: 1,
            },
          },
          {
            $sort: {
              "date.unix_timestamp": -1,
            },
          },
        ];
        const aggregation = Purchase.aggregate(pipeline);
        const data = await Purchase.aggregatePaginate(aggregation, options);
        console.log("data", JSON.stringify(data));
        return data;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
  };
};
