const mongoose = require("mongoose");
module.exports = (
  Admin,
  Purchase,
  PayCreditReceipt,
  startOfMonth,
  endOfMonth
) => {
  return {
    getPurchasesReport: async ({ date, admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              _id: mongoose.Types.ObjectId(admin),
            },
          },
          {
            $project: {
              _id: 1,
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
                              startOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              endOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                      ],
                    },
                  },
                },
                // group by day
                // {$unwind: "$items"},
                {
                  $group: {
                    _id: { $dayOfMonth: "$date.utc_date" },
                    purchases: {
                      $sum: {
                        $sum: "$items.orders",
                      },
                    },
                    sales: {
                      $sum: {
                        $sum: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: {
                              $multiply: ["$$item.orders", "$$item.price"],
                            },
                          },
                        },
                      },
                    },
                    // calculate paid and unpaid amount
                    paid_orders: {
                      $sum: {
                        $subtract: [
                          { $sum: "$items.orders" },
                          { $sum: "$items.credit" },
                        ],
                      },
                    },
                    paid_orders_amount: { $sum: "$order_to_pay" },
                    credited_gallon: {
                      $sum: {
                        $sum: "$items.credit",
                      },
                    },
                    credited_amount: {
                      $sum: {
                        $multiply: [
                          { $sum: "$items.credit" },
                          { $sum: "$items.price" },
                        ],
                      },
                    },
                    // total_sales: {
                    //   $sum: {
                    //     $sum: {
                    //       $map: {
                    //         input: "$items",
                    //         as: "item",
                    //         in: {
                    //           $multiply: ["$$item.orders", "$$item.price"],
                    //         },
                    //       },
                    //     },
                    //   },
                    // },
                  },
                },
                // group by month
                {
                  $sort: {
                    _id: 1,
                  },
                },
              ],
              as: "purchases",
            },
          },

          //   expenses
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
                              startOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              endOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $group: {
                    _id: { $dayOfMonth: "$date.utc_date" },
                    amount: {
                      $sum: { $sum: "$amount" },
                    },
                  },
                },
                {
                  $sort: {
                    _id: 1,
                  },
                },
              ],
              as: "expenses",
            },
          },
          //   pay credits receipts
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
                              startOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(
                              endOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $group: {
                    _id: { $dayOfMonth: "$date.utc_date" },
                    amount_paid: {
                      $sum: "$amount_paid",
                    },
                  },
                },
                {
                  $sort: {
                    _id: 1,
                  },
                },
              ],
              as: "paid_credits",
            },
          },
          {
            $lookup: {
              from: "credits",
              localField: "_id",
              foreignField: "admin",
              pipeline: [
                {
                  $match: {
                    total: { $gt: 0 },
                  },
                },
                {
                  $group: {
                    _id: "$customer",
                    unpaid_credits_amount: {
                      $sum: {
                        $sum: {
                          $multiply: ["$price", "$total"],
                        },
                      },
                    },
                    credits_gallon_count: {
                      $sum: "$total",
                    },
                    credits_people: {
                      $sum: 1,
                    },
                  },
                },
              ],
              as: "credits",
            },
          },
          {
            $project: {
              purchases: 1,
              expenses: 1,
              paid_credits: 1,
              sales: 1,
              credits: 1,
              total_purchased_product: {
                $sum: "$purchases.purchases",
              },
              total_paid_product: {
                $sum: "$purchases.paid_orders",
              },
              total_paid_product_amount: {
                $sum: "$purchases.paid_orders_amount",
              },
              total_unpaid_amount: {
                $sum: "$purchases.credited_amount",
              },
              total_credited_gallons_count: {
                $sum: "$purchases.credited_gallon",
              },
              total_sales: { $sum: "$purchases.sales" },
              total_expenses: {
                $sum: "$expenses.amount",
              },
              debt_payment_received: {
                $sum: "$paid_credits.amount_paid",
              },
              total_credits_gallon_count: {
                $sum: "$credits.credits_gallon_count",
              },
              total_credits_amount: {
                $sum: "$credits.unpaid_credits_amount",
              },
              total_customers_with_credit: {
                $sum: "$credits.credits_people",
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
        console.log(data[0].total_sales);
        return { data };
      } catch (error) {
        console.log("errrrrrrrrrr", error);
        return { error };
      }
    },
  };
};
