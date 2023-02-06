const mongoose = require("mongoose");
module.exports = (Purchase) => {
  return {
    getSummaryOfDeliveryFromPurchases: async ({ delivery_id, admin }) => {
      console.log("delivery_id", delivery_id);
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
        console.log("[DATAAA]", data);
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
            $sort: { "date.unix_timestamp": 1 },
          },
          {
            $skip: Number(skip),
          },
          {
            $limit: Number(limit),
          },
          // {
          //   $lookup: {
          //     from: "gallons",
          //     localField: "items.gallon",
          //     foreignField: "_id",
          //     pipeline: [
          //       {
          //         $project: {
          //           name: 1,
          //           gallon_image: 1,
          //         },
          //       },
          //     ],
          //     as: "items.gallon",
          //   },
          // },
          {
            $project: {
              items: 1,
              total_orders: {
                $sum: "$items.orders",
              },
              total_payment: 1,
              order_to_pay: 1,
              debt_payment: 1,
              date: 1,
            },
          },
        ];
        const data = await Purchase.aggregate(pipeline);
        console.log("[data-purchase-history]", data);
        return { data };
      } catch (error) {
        console.log("[data-purchase-history]", error);
        return { error };
      }
    },
  };
};
