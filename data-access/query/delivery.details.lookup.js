const mongoose = require("mongoose");
module.exports = (Schedule) => {
  return {
    getScheduleDetails: async ({ admin, schedule_id, items }) => {
      try {
        const pipeline = [
          {
            $match: {
              _id: mongoose.Types.ObjectId(schedule_id),
            },
          },
          // admin
          {
            $lookup: {
              from: "admins",
              localField: "admin",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    wrs_name: 1,
                    gmail: 1,
                  },
                },
              ],
              as: "admin",
            },
          },
          // personel
          {
            $lookup: {
              from: "personels",
              localField: "assigned_to",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    firstname: 1,
                    lastname: 1,
                    contact_number: 1,
                    gmail:1,
                  },
                },
              ],
              as: "personnel",
            },
          },
          // customer details
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
                    gmail: 1,
                  },
                },
              ],
              as: "customer",
            },
          },
          // lookup for gallon items.
          {
            $lookup: {
              from: "gallons",
              localField: "items.gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    liter: 1,
                    gallon_image: 1,
                  },
                },
              ],
              as: "gallons",
            },
          },

          {
            $project: {
              admin: 1,
              personnel: 1,
              customer: 1,
              createdAt: 1,
              total_items: {
                $sum: {
                  $sum: "$items.total",
                },
              },

              // join item of $items and gallons
              purchasedItems: {
                $map: {
                  input: items,
                  as: "item",
                  in: {
                    $map: {
                      input: "$gallons",
                      as: "gallon",
                      in: {
                        purchasedItem: {
                          // condition
                          $cond: {
                            if: { $eq: ["$$gallon._id", "$$item.gallon"] },
                            then: {
                              _id: "$$gallon._id",
                              name: "$$gallon.name",
                              liter: "$$gallon.liter",
                              gallon_image: "$$gallon.gallon_image",
                              orders: "$$item.orders",
                              price: "$$item.price",
                              credit: "$$item.credit",
                              free: "$$item.free",
                            },
                            else: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              admin: 1,
              personnel: 1,
              customer: 1,
              createdAt: 1,
              total_items: 1,
              // join item of $items and gallons
              purchasedItems: {
                $reduce: {
                  input: {
                    $map: {
                      input: "$purchasedItems",
                      as: "purchased",
                      in: {
                        $filter: {
                          input: "$$purchased",
                          as: "purch",
                          cond: {
                            $ne: ["$$purch.purchasedItem", null],
                          },
                        },
                      },
                    },
                  },
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
            },
          },
        ];
        // wrs_name, personnel_name, address, order_details, date_of_scheduled,
        // estimated_delivery_date,
        const data = await Schedule.aggregate(pipeline);

        return { data };
      } catch (error) {
        console.log("error==>>>>>>", error);
        return { error };
      }
    },
  };
};
