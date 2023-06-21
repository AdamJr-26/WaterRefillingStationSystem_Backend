const mongoose = require("mongoose");

module.exports = (Delivery, Purchase, Personel, endOfDay, startOfDay) => {
  return {
    getPersonelDelivery: async (payload, selected) => {
      try {
        const filter = {
          delivery_personel: payload?.delivery_personel,
          returned: false,
        };
        const data = await Delivery.findOne(filter).select(selected).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },

    getApprovedDelivery: async (payload, selected) => {
      //am not gonna use it again?
      try {
        const filter = {
          delivery_personel: payload?.delivery_personel,
          approved: true,
          returned: false,
        };
        const data = await Delivery.findOne(filter).select(selected).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    // not been used. violation: (do not create future feature)
    getAllItemsGreaterThanEqualOrderedItem: async ({
      delivery_id,
      purchase_item,
    }) => {
      const total_orders =
        Number(purchase_item.orders) + Number(purchase_item.free);

      try {
        const pipelines = [
          {
            $match: {
              _id: delivery_id,
            },
          },
          {
            $project: {
              // _id: delivery_id,
              delivery_items: {
                $filter: {
                  input: "$delivery_items",
                  as: "item",
                  cond: {
                    $and: [
                      { $gte: ["$$item.total", total_orders] },
                      {
                        $eq: [
                          "$$item.gallon",
                          { $toObjectId: purchase_item.gallon },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        ];
        const data = await Delivery.aggregate(pipelines);
        return { data: data[0] };
      } catch (error) {
        return { error };
      }
    },

    // this the not approved yet delivery
    getPopulatedDeliveries: async (payload) => {
      try {
        const filter = {
          admin: payload?.admin,
          approved: payload?.isApproved,
          returned: false,
        };
        const data = await Delivery.find(filter)
          .populate([
            {
              path: "delivery_personel",
              model: "Personel",
              select: "firstname lastname contact_number display_photo ",
            },
            {
              path: "vehicle",
              model: "Vehicle",
              select: "vehicle_name vehicle_id ",
            },
            {
              path: "delivery_items.gallon",
              model: "Gallon",
              select: "name liter",
            },
          ])
          .exec();
        // check if all refs are populate using model.field instanceofObjectId
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getPopulatedDeliveriesByPersonel: async (payload) => {
      try {
        const filter = {
          admin: payload?.admin,
          delivery_personel: payload?.delivery_personel,
          returned: payload?.isReturned,
        };
        const data = await Delivery.findOne(filter)
          .populate([
            {
              path: "vehicle",
              model: "Vehicle",
              select: "vehicle_name vehicle_id vehicle_image",
            },
            {
              path: "delivery_items.gallon",
              model: "Gallon",
              select: "name liter gallon_image",
            },
          ])
          .exec();
        // check if all refs are populate using model.field instanceofObjectId
        return { data };
      } catch (error) {
        return { error };
      }
    },
    // its querying the Purchase collection but using delivery id
    // the purpose of this is all about recent deliveries.
    getRecentDeliveries: async ({ personel_id, admin }) => {
      try {
        const deliveries = await Delivery.find({
          returned: true,
          delivery_personel: personel_id,
          admin: admin,
          "date_of_creation.utc_date": {
            $gte: startOfDay(new Date()),
            $lte: endOfDay(new Date()),
          },
        })
          .select(["_id"])
          .exec();

        const stages = [
          {
            $match: {
              personel: personel_id,
              delivery: { $in: deliveries?.map((delivery) => delivery._id) },
              "date.utc_date": {
                $gte: startOfDay(new Date()),
                $lte: endOfDay(new Date()),
              },
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
        console.log("[error]", error);
        return { error };
      }
    },
    getOngoingDeliveries: async ({ admin, page, limit }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };

        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              approved: true,
              returned: false,
            },
          },
          {
            $lookup: {
              from: "vehicles",
              localField: "vehicle",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    vehicle_name: 1,
                    vehicle_image: 1,
                    vehicle_id: 1,
                  },
                },
              ],
              as: "vehicle",
            },
          },
          {
            $lookup: {
              from: "personels", // personnels
              localField: "delivery_personel",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    firstname: 1,
                    lastname: 1,
                    gender: 1,
                    contact_number: 1,
                    display_photo: 1,
                    fullname: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                  },
                },
              ],
              as: "delivery_personnel",
            },
          },
          {
            $project: {
              _id: 1,
              date_of_creation: 1,
              returned: 1,
              approved: 1,
              admin: 1,
              personnel: {
                $arrayElemAt: ["$delivery_personnel", 0],
              },
              vehicle: {
                $arrayElemAt: ["$vehicle", 0],
              },
            },
          },
        ];

        const aggregation = Delivery.aggregate(pipeline);
        const data = await Delivery.aggregatePaginate(aggregation, options);
        console.log("ongoing-deliveries", data);
        return { data };
      } catch (error) {
        console.log("date_of_creation", error);
        return { error };
      }
    },
    getFinishedDeliveries: async ({ admin, page, limit }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        // const match =
        //   from != "null" && to != "null"
        //     ? {
        //         $match: {
        //           admin: mongoose.Types.ObjectId(admin),
        //           returned: true,
        //           approved: true,
        //           $expr: {
        //             $and: [
        //               {
        //                 $gte: [
        //                   "$finished_date.unix_timestamp",
        //                   Math.floor(new Date(from).valueOf() / 1000),
        //                 ],
        //               },
        //               {
        //                 $lte: [
        //                   "$finished_date.unix_timestamp",
        //                   Math.floor(new Date(to).valueOf() / 1000),
        //                 ],
        //               },
        //             ],
        //           },
        //         },
        //       }
        //     : {
        //         $match: {
        //           admin: mongoose.Types.ObjectId(admin),
        //           returned: true,
        //           approved: true,
        //           "finished_date.utc_date": {
        //             $gte: startOfDay(new Date()),
        //             $lte: endOfDay(new Date()),
        //           },
        //         },
        //       };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              returned: true,
              approved: true,
              // "finished_date.utc_date": {
              //   $gte: startOfDay(new Date()),
              //   $lte: endOfDay(new Date()),
              // },
            },
          },
          {
            $sort: { "finished_date.unix_timestamp": -1 },
          },

          {
            $lookup: {
              from: "vehicles",
              localField: "vehicle",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    vehicle_name: 1,
                    vehicle_image: 1,
                    vehicle_id: 1,
                  },
                },
              ],
              as: "vehicle",
            },
          },
          {
            $lookup: {
              from: "personels", // personnels
              localField: "delivery_personel",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    firstname: 1,
                    lastname: 1,
                    gender: 1,
                    contact_number: 1,
                    display_photo: 1,
                    fullname: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                  },
                },
              ],
              as: "delivery_personnel",
            },
          },
          {
            $project: {
              _id: 1,
              date_of_creation: 1,
              returned: 1,
              approved: 1,
              admin: 1,
              personnel: {
                $arrayElemAt: ["$delivery_personnel", 0],
              },
              vehicle: {
                $arrayElemAt: ["$vehicle", 0],
              },
            },
          },
        ];

        const aggregation = Delivery.aggregate(pipeline);
        const data = await Delivery.aggregatePaginate(aggregation, options);
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getDeliveryProgress: async ({ delivery_id, admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              _id: mongoose.Types.ObjectId(delivery_id),
            },
          },
          {
            $lookup: {
              from: "gallons",
              localField: "dispatched_items.gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "dispatched_gallons",
            },
          },
          {
            $lookup: {
              from: "purchases",
              localField: "_id",
              foreignField: "delivery",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    items: 1,
                  },
                },
                {
                  $unwind: "$items",
                },
                {
                  $group: {
                    _id: "$items.gallon",
                    soldGallon: {
                      $sum: {
                        $sum: ["$items.orders", "$items.free"],
                      },
                    },
                  },
                },
              ],
              as: "purchases",
            },
          },
          {
            $project: {
              _id: 1,
              purchases: 1,
              dispatched_date_time: "$approved_date",
              dispatched_date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: {
                    $toDate: { $multiply: ["$approved_date", 1000] },
                  },
                },
              },
              dispatched_items: {
                $map: {
                  input: "$dispatched_items",
                  as: "item",
                  in: {
                    $reduce: {
                      input: {
                        $map: {
                          input: "$dispatched_gallons",
                          as: "dispatched",
                          in: {
                            $cond: {
                              if: {
                                $eq: ["$$item.gallon", "$$dispatched._id"],
                              },
                              then: {
                                _id: "$$dispatched._id",
                                name: "$$dispatched.name",
                                quantity: "$$item.total",
                              },
                              else: null,
                            },
                          },
                        },
                      },
                      initialValue: [],
                      in: {
                        $cond: {
                          if: { $ne: ["$$this", null] },
                          then: { $concatArrays: ["$$value", ["$$this"]] },
                          else: "$$value",
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
              _id: 1,
              dispatched_date_time: 1,
              dispatched_date: 1,
              purchases: 1,
              dispatched_items: {
                $reduce: {
                  input: "$dispatched_items",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
            },
          },
          {
            $project: {
              _id: 1,
              dispatched_date_time: 1,
              dispatched_date: 1,
              purchases: 1,
              no_purchased_items: "$dispatched_items",
              dispatched_items: {
                $map: {
                  input: "$dispatched_items",
                  as: "item",
                  in: {
                    $reduce: {
                      input: {
                        $map: {
                          input: "$purchases",
                          as: "purch",
                          in: {
                            $cond: {
                              if: {
                                $eq: ["$$item._id", "$$purch._id"],
                              },
                              then: {
                                _id: "$$item._id",
                                name: "$$item.name",
                                quantity: "$$item.quantity",
                                soldGallon: "$$purch.soldGallon",
                              },
                              else: null,
                            },
                          },
                        },
                      },
                      initialValue: [],
                      in: {
                        $cond: {
                          if: { $ne: ["$$this", null] },
                          then: { $concatArrays: ["$$value", ["$$this"]] },
                          else: "$$value",
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
              _id: 1,
              dispatched_date_time: 1,
              dispatched_date: 1,
              purchases: 1,
              no_purchased_items: 1,
              dispatched_items: {
                $reduce: {
                  input: "$dispatched_items",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
            },
          },
        ];

        const data = await Delivery.aggregate(pipeline);
        console.log("[delivery.query]", JSON.stringify(data));
        return { data };
      } catch (error) {
        console.log("[derror]", error);
        return { error };
      }
    },
    recommendedLoad: async ({ vehicle, admin, personnel }) => {
      try {
        // get all assigned schedules from personnel.
        // get limit of vehicle
        // fetch all by admin.
        // get all items of orders from assigned schedule from personnel.
        const pipeline = [
          // get the
          {
            $match: {
              _id: mongoose.Types.ObjectId(personnel),
            },
          },
          {
            $project: {
              personnelId: "$_id",
              adminId: "$admin",
            },
          },
          {
            $addFields: {
              vehicleId: mongoose.Types.ObjectId(vehicle),
            },
          },
          // get the vehicle.
          {
            $lookup: {
              from: "vehicles",
              let: { vehicleId: "$vehicleId" },
              localField: "adminId",
              foreignField: "admin",
              pipeline: [
                {
                  $match: {
                    _id: mongoose.Types.ObjectId(vehicle),
                  },
                },
                {
                  $match: {
                    loadLimit: { $exists: true },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    vehicle_name: 1,
                    loadLimit: 1,
                  },
                },
              ],
              as: "vehicle",
            },
          },
          { $unwind: "$vehicle" },
          // get all assigned schedules to the customer.
          {
            $lookup: {
              from: "schedules",
              localField: "personnelId",
              foreignField: "assigned_to",
              pipeline: [
                {
                  $lookup: {
                    from: "gallons",
                    let: { total: "$total" },
                    localField: "items.gallon",
                    foreignField: "_id",
                    pipeline: [
                      {
                        $project: {
                          _id: 1,
                          name: 1,
                          totalGallon: "$$total",
                          liter: 1,
                          gallon_image: 1,
                          admin: 1,
                          price: 1,
                          container_price: 1,
                        },
                      },
                    ],
                    as: "gallons",
                  },
                },
                {
                  $project: {
                    items: {
                      $map: {
                        input: "$items",
                        as: "item",
                        in: {
                          $mergeObjects: [
                            "$$item",
                            {
                              $arrayElemAt: [
                                "$gallons",
                                {
                                  $indexOfArray: [
                                    "$gallons._id",
                                    "$$item.gallon",
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    totalLitersPerSchedules: {
                      $sum: "$items.liter",
                    },
                  },
                },
              ],
              as: "assignedSchedules",
            },
          },
          {
            $addFields: {
              totalLitersFromSchedules: {
                $sum: "$assignedSchedules.totalLitersPerSchedules",
              },
            },
          },
          {
            $addFields: {
              validCapacity: {
                $cond: {
                  if: {
                    $gte: ["$vehicle.loadLimit", "$totalLitersFromSchedules"],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          { $unwind: "$assignedSchedules" },
          { $unwind: "$assignedSchedules.items" },
          {
            $group: {
              _id: "$assignedSchedules.items.admin",
              validCapacity: { $first: "$validCapacity" },
              vehicleLoadLimit: { $first: "$vehicle.loadLimit" },
              totalLoadOnAssignedSchedules: {
                $first: "$totalLitersFromSchedules",
              },
              totalExceed: {
                $sum: {
                  $subtract: [
                    "$totalLitersFromSchedules",
                    "$vehicle.loadLimit",
                  ],
                },
              },
              orderedGallons: {
                $push: "$assignedSchedules.items",
              },
            },
          },
        ];

        const data = await Personel.aggregate(pipeline);
        return data;
      } catch (error) {
        console.log("errror", error);
        throw error;
      }
    },
    deliveryRoutesDetails: async ({ delivery }) => {
      try {
        const pipeline = [
          {
            $match: {
              _id: mongoose.Types.ObjectId(delivery),
            },
          },
          {
            $lookup: {
              from: "personels",
              localField: "delivery_personel",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullName: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                  },
                },
              ],
              as: "personnels",
            },
          },
          { $unwind: "$personnels" },
          {
            $lookup: {
              from: "schedules",
              localField: "selectedRoutes.schedule",
              foreignField: "_id",
              pipeline: [
                {
                  $lookup: {
                    from: "gallons",
                    let: { total: "$total" },
                    localField: "items.gallon",
                    foreignField: "_id",
                    pipeline: [
                      {
                        $project: {
                          name: 1,
                          admin: 1,
                          _id: 1,
                        },
                      },
                    ],
                    as: "gallons",
                  },
                },
                {
                  $project: {
                    customer: 1,
                    items: {
                      $map: {
                        input: "$items",
                        as: "item",
                        in: {
                          $mergeObjects: [
                            "$$item",
                            {
                              $arrayElemAt: [
                                "$gallons",
                                {
                                  $indexOfArray: [
                                    "$gallons._id",
                                    "$$item.gallon",
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      },
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
                        $addFields: {
                          fullName: {
                            $concat: ["$firstname", " ", "$lastname"],
                          },
                          fullAddress: {
                            $concat: [
                              "$address.street",
                              " ",
                              "$address.barangay",
                              " ",
                              "$address.municipal_city",
                              " ",
                              "$address.province",
                            ],
                          },
                        },
                      },
                      {
                        $project: {
                          fullName: 1,
                          fullAddress: 1,
                        },
                      },
                    ],
                    as: "customer",
                  },
                },
                {
                  $unwind: "$customer",
                },
                {
                  $addFields: {
                    scheduleOrdered: { $sum: "$items.total" },
                  },
                },
              ],
              as: "assignedSchedules",
            },
          },
          {
            $project: {
              assignedSchedules: 1,
            },
          },
        ];
        const data = await Delivery.aggregate(pipeline);
        return data;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
  };
};
