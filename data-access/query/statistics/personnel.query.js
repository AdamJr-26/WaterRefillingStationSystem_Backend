const monogoose = require("mongoose");

module.exports = (Personnel, startOfMonth, endOfMonth) => {
  return {
    getPersonnelsSalesAchievements: async ({ admin, date, top }) => {
      try {
        console.log(" admin, date, top ",  admin, date, top )
        const pipeline = [
          {
            $match: {
              admin: monogoose.Types.ObjectId(admin),
              position: "Delivery Personel", //Delivery Personnel
            },
          },
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              display_photo: 1,
              position: 1,
            },
          },
          {
            $lookup: {
              from: "purchases",
              localField: "_id",
              foreignField: "personel",
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
                    _id: "$personel", // personnel id.
                    sales: {
                      $sum: {
                        $multiply: [
                          { $sum: "$items.orders" },
                          {
                            $sum: "$items.price",
                          },
                        ],
                      },
                    },
                    sold_product: {
                      $sum: {
                        $subtract: [
                          { $sum: "$items.orders" },
                          { $sum: "$items.credit" },
                        ],
                      },
                    },
                    sold_product_amount: {
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
                  },
                },
              ],
              as: "purchases",
            },
          },
          {
            $lookup: {
              from: "deliveries",
              localField: "_id",
              foreignField: "delivery_personel", // personnel id
              pipeline: [
                {
                  $match: {
                    returned: true,
                    approved: true,
                    $expr: {
                      $and: [
                        {
                          $gte: [
                            "$finished_date.unix_timestamp",
                            Math.floor(
                              startOfMonth(new Date(date)).valueOf() / 1000
                            ),
                          ],
                        },
                        {
                          $lte: [
                            "$finished_date.unix_timestamp",
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
                    _id: "$delivery_personel",
                    total_deliveries: {
                      $sum: 1,
                    },
                  },
                },
              ],
              as: "deliveries",
            },
          },
          {
            $match: {
              "purchases.sales": { $gt: 0 },
            },
          },
          {
            $sort: {
              "purchases.sales": -1,
            },
          },
          {
            $limit: Number(top),
          },
        ];
        const data = await Personnel.aggregate(pipeline);
        console.log("data-----------------", JSON.stringify(data));
        return { data };
      } catch (error) {
        console.log("error", error);
        return { error };
      }
    },
  };
};
