const mongoose = require("mongoose");
const { sub, format, parseISO } = require("date-fns");
module.exports = (Admin, startOfDay, endOfDay) => {
  return {
    // for dashboard api. that display cash received,sales, expenses
    getTodaysCashTransaction: async ({ date, admin }) => {
      try {
        const today = new Date(date);
        const yesterday = new Date(sub(today, { days: 1 }));
        const formattedToday = format(today, "yyyy-MM-dd");
        const formattedYesterday = format(yesterday, "yyyy-MM-dd");
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
          // get today purchases, pay credits, expenses.
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
                            Math.floor(startOfDay(yesterday).valueOf() / 1000),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(endOfDay(today).valueOf() / 1000),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    date: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date.utc_date",
                      },
                    },
                    items: 1,
                    total_payment: 1,
                    order_to_pay: 1,
                    debt_payment: 1,
                  },
                },
                {
                  $group: {
                    _id: "$date",
                    date: { $first: "$date" },
                    payments: { $sum: "$order_to_pay" }, // halaga ng kailangan bayaran ng bawat purchase.
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
                  },
                },
                {
                  $sort: {
                    _id: -1,
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
                            Math.floor(startOfDay(yesterday).valueOf() / 1000),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(endOfDay(today).valueOf() / 1000),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    date: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date.utc_date",
                      },
                    },
                    amount_paid: 1,
                    gallon_count: 1,
                  },
                },
                {
                  $group: {
                    _id: "$date",
                    amount_paid: { $sum: "$amount_paid" },
                    gallon_count: { $sum: "$gallon_count" },
                  },
                },
                {
                  $sort: {
                    _id: -1,
                  },
                },
              ],
              as: "credits",
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
                            Math.floor(startOfDay(yesterday).valueOf() / 1000),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(endOfDay(today).valueOf() / 1000),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    date: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date.utc_date",
                      },
                    },
                    expense_title: 1,
                    amount: 1,
                  },
                },
                {
                  $group: {
                    _id: "$date",
                    amount: { $sum: "$amount" },
                  },
                },
                {
                  $sort: {
                    _id: -1,
                  },
                },
              ],
              as: "expenses",
            },
          },
          {
            $lookup: {
              from: "soldcontainers",
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
                            Math.floor(startOfDay(yesterday).valueOf() / 1000),
                          ],
                        },
                        {
                          $lte: [
                            "$date.unix_timestamp",
                            Math.floor(endOfDay(today).valueOf() / 1000),
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    date: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date.utc_date",
                      },
                    },
                    orderTotal: 1,
                  },
                },
                {
                  $group: {
                    _id: "$date",
                    orderTotal: { $sum: "$orderTotal" },
                  },
                },
                {
                  $sort: {
                    _id: -1,
                  },
                },
              ],
              as: "soldContainers",
            },
          },
          {
            $project: {
              todayPurchasePayments: {
                $sum: {
                  $map: {
                    input: "$purchases",
                    as: "purchase",
                    in: {
                      $cond: {
                        if: { $eq: ["$$purchase._id", formattedToday] },
                        then: "$$purchase.payments",
                        else: 0,
                      },
                    },
                  },
                },
              },
              todayCreditsPayments: {
                $sum: {
                  $map: {
                    input: "$credits",
                    as: "credit",
                    in: {
                      $cond: {
                        if: { $eq: ["$$credit._id", formattedToday] },
                        then: "$$credit.amount_paid",
                        else: 0,
                      },
                    },
                  },
                },
              },
              expenseToday: {
                $sum: {
                  $map: {
                    input: "$expenses",
                    as: "expense",
                    in: {
                      $cond: {
                        if: { $eq: ["$$expense._id", formattedToday] },
                        then: "$$expense.amount",
                        else: 0,
                      },
                    },
                  },
                },
              },
              expenseYesterday: {
                $sum: {
                  $map: {
                    input: "$expenses",
                    as: "expense",
                    in: {
                      $cond: {
                        if: { $eq: ["$$expense._id", formattedYesterday] },
                        then: "$$expense.amount",
                        else: 0,
                      },
                    },
                  },
                },
              },
              salesToday: {
                $sum: {
                  $map: {
                    input: "$purchases",
                    as: "purchase",
                    in: {
                      $cond: {
                        if: { $eq: ["$$purchase._id", formattedToday] },
                        then: "$$purchase.sales",
                        else: 0,
                      },
                    },
                  },
                },
              },
              salesYesterday: {
                $sum: {
                  $map: {
                    input: "$purchases",
                    as: "purchase",
                    in: {
                      $cond: {
                        if: { $eq: ["$$purchase._id", formattedYesterday] },
                        then: "$$purchase.sales",
                        else: 0,
                      },
                    },
                  },
                },
              },
              todaySoldContainers: {
                $sum: {
                  $map: {
                    input: "$soldContainers",
                    as: "soldContainer",
                    in: {
                      $cond: {
                        if: { $eq: ["$$soldContainer._id", formattedToday] },
                        then: "$$soldContainer.orderTotal",
                        else: 0,
                      },
                    },
                  },
                },
              },
              yesterdaySoldContainers: {
                $sum: {
                  $map: {
                    input: "$soldContainers",
                    as: "soldContainer",
                    in: {
                      $cond: {
                        if: {
                          $eq: ["$$soldContainer._id", formattedYesterday],
                        },
                        then: "$$soldContainer.orderTotal",
                        else: 0,
                      },
                    },
                  },
                },
              },
            },
          },
          // increase/decrease by percentage = total ammount / difference of sales today and yesterday * 100
          {
            $addFields: {
              totalSalesToday: {
                $sum: ["$salesToday", "$todaySoldContainers"],
              },
              totalSalesYesterday: {
                $sum: ["$salesYesterday", "$yesterdaySoldContainers"],
              },
            },
          },
          {
            $addFields: {
              cashReceiveToday: {
                $sum: [
                  "$todayPurchasePayments",
                  "$todayCreditsPayments",
                  "$todaySoldContainers",
                ],
              },
              expensesPercentage: {
                $toString: {
                  $cond: {
                    if: {
                      $eq: [
                        { $sum: ["$expenseToday", "$expenseYesterday"] },
                        0,
                      ],
                    },
                    then: "N/A", // or any other value you prefer for this case
                    else: {
                      $toString: {
                        $round: [
                          {
                            $multiply: [
                              {
                                $divide: [
                                  {
                                    $subtract: [
                                      "$expenseToday",
                                      "$expenseYesterday",
                                    ],
                                  },
                                  {
                                    $sum: [
                                      "$expenseToday",
                                      "$expenseYesterday",
                                    ],
                                  },
                                ],
                              },
                              100,
                            ],
                          },
                          2,
                        ],
                      },
                    },
                  },
                },
              },

              salesPercentage: {
                $toString: {
                  $cond: {
                    if: {
                      $eq: [{ $sum: ["$salesToday", "$salesYesterday"] }, 0],
                    },
                    then: "N/A", // or any other value you prefer for this case
                    else: {
                      $toString: {
                        $round: [
                          {
                            $multiply: [
                              {
                                $divide: [
                                  {
                                    $subtract: [
                                      "$totalSalesToday",
                                      "$totalSalesYesterday",
                                    ],
                                  },
                                  {
                                    $sum: [
                                      "$totalSalesToday",
                                      "$totalSalesYesterday",
                                    ],
                                  },
                                ],
                              },
                              100,
                            ],
                          },
                          2,
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        ];

        const data = await Admin.aggregate(pipeline);
        console.log("data daily ->>>>>>>>>", JSON.stringify(data));
        return { data };
      } catch (error) {
        console.log("error daily transaction->>>>>>", error);
        return { error };
      }
    },
  };
};
