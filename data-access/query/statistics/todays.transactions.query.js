const mongoose = require("mongoose");
module.exports = (Admin, startOfDay, endOfDay) => {
  return {
    // for dashboard api. that display cash received,sales, expenses
    getTodaysCashTransaction: async ({ date, admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              _id: mongoose.Types.ObjectId(admin),
            },
          },
          {
            $lookup: {
              from: "purchases",
              localField: "_id",
              foreignField: "admin",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $gte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              startOfDay(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              endOfDay(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    paid_orders_amount: {
                      $sum: {
                        $multiply: [
                          {
                            $subtract: [
                              { $sum: "$items.orders" },
                              { $sum: "$items.credit" },
                            ],
                          },
                          {
                            $sum: "$items.price",
                          },
                        ],
                      },
                    },
                    total_orders_paid_unpaid_amount: {
                      $sum: {
                        $multiply: [
                          { $sum: "$items.orders" },
                          {
                            $sum: "$items.price",
                          },
                        ],
                      },
                    },
                  },
                },
              ],
              as: "purchases",
            },
          },
          {
            $lookup: {
              from: "paycreditreceipts",
              localField: "_id",
              foreignField: "admin",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $gte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              startOfDay(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              endOfDay(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    amount_paid: {
                      $sum: "$amount_paid",
                    },
                  },
                },
              ],
              as: "paid_credits",
            },
          },
          {
            $lookup: {
              from: "expenses",
              localField: "_id",
              foreignField: "admin",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $gte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              startOfDay(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              endOfDay(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    amount: {
                      $sum: { $sum: "$amount" },
                    },
                  },
                },
              ],
              as: "expenses",
            },
          },
          {
            $project: {
              total_expenses: {
                $sum: "$expenses.amount",
              },
              total_sales: {
                $sum: "$purchases.total_orders_paid_unpaid_amount",
              },
              paidProducts: {
                $sum: [
                  { $sum: "$purchases.paid_orders_amount" },
                  { $sum: "$paid_credits.amount_paid" },
                ],
              },
            },
          },
        ];

        const data = await Admin.aggregate(pipeline);
        console.log("data", JSON.stringify(data));
        return { data };
      } catch (error) {
        console.log("error", error);
        return { error };
      }
    },
  };
};
