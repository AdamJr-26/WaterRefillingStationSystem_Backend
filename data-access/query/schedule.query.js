const mongoose = require("mongoose");

module.exports = (Schedule, endOfDay, startOfDay) => {
  return {
    checkIfcustomerHasSchedule: async (payload) => {
      try {
        const filter = {
          customer: payload?.customer?.toString(),
          admin: payload?.admin?.toString(),
          isCanceled: false,
        };
        const data = await Schedule.find(filter).exec();

        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAssignedScheduleByPersonel: async (payload) => {
      try {
        const filter = {
          assigned: true,
          isCanceled: false,
          assigned_to: payload.personel_id,
        };
        const data = await Schedule.find(filter)
          .populate([
            {
              path: "customer",
              model: "Customer",
              select: "firstname lastname address mobile_number display_photo",
            },
            {
              path: "items.gallon",
              model: "Gallon",
              select: " admin _id name liter gallon_image price ",
            },
          ])
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getSchedulesByDate: async ({ date, admin, place }) => {
      console.log("place", place);
      try {
        const pipelines = [
          {
            //para imatch sa documents
            $match: {
              assigned: false,
              accepted: true,
              isCanceled: false,
              admin: mongoose.Types.ObjectId(admin),
              "schedule.utc_date": {
                $gte: startOfDay(new Date(date)),
                $lte: endOfDay(new Date(date)),
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
                    trimmedBarangay: { $trim: { input: "$address.barangay" } },
                  },
                },
                { $match: { $expr: { $eq: ["$trimmedBarangay", place] } } },
              ],
              as: "customer",
            },
          },
          {
            $match: {
              $expr: { $ne: ["$customer", []] },
            },
          },
          {
            // para ipopulate yung items
            $lookup: {
              from: "gallons",
              localField: "items.gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    liter: 0,
                    total: 0,
                    borrowed: 0,
                    price: 0,
                  },
                },
              ],
              as: "fromItems",
            },
          },
        ];
        const docs = await Schedule.aggregate(pipelines);
        console.log("docs", docs);
        for await (const doc of docs) {
          doc.fromItems.forEach((item, index) => {
            item["total"] = doc.items[index].total;
          });
        }
        return { data: docs };
      } catch (error) {
        return { error };
      }
    },
    getOutdatedSchedules: async ({ admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              assigned: false,
              isCanceled: false,
              "schedule.utc_date": {
                $lt: startOfDay(new Date()), // get a date from the user
              },
            },
          },
          {
            $lookup: {
              from: "customers",
              localField: "customer",
              foreignField: "_id",
              as: "customer",
            },
          },
          {
            // para ipopulate yung items
            $lookup: {
              from: "gallons",
              localField: "items.gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    liter: 0,
                    total: 0,
                    borrowed: 0,
                    price: 0,
                  },
                },
              ],
              as: "fromItems",
            },
          },
        ];
        const docs = await Schedule.aggregate(pipeline);
        for await (const doc of docs) {
          doc.fromItems.forEach((item, index) => {
            item["total"] = doc.items[index].total;
          });
        }

        return { data: docs };
      } catch (error) {
        console.log("errorerror", error);
        return { error };
      }
    },
    getSchedulesAndSearchApproved: async ({ search, page, limit, admin }) => {
      try {
        console.log("search", search);
        const options = { ...(page && limit ? { page, limit } : {}) };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              // add match for approved
              accepted: true, // it should be true
              isCanceled: false,
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
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    display_photo: 1,
                    fullname: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                    type: "$customer_type",
                  },
                },
                {
                  $addFields: {
                    firstToLast: { $concat: ["$firstname", " ", "$lastname"] },
                    lastToFirst: { $concat: ["$lastname", " ", "$firstname"] },
                  },
                },

                {
                  $match:
                    search !== "null"
                      ? {
                          $or: [
                            { firstToLast: { $regex: search, $options: "i" } },
                            { lastToFirst: { $regex: search, $options: "i" } },
                          ],
                        }
                      : {},
                },
              ],
              as: "customer",
            },
          },
          {
            $match: {
              $expr: {
                $ne: ["$customer", []],
              },
            },
          },
          {
            $unwind: "$customer",
          },
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
                  },
                },
              ],
              as: "ordered_gallons",
            },
          },
          {
            $group: {
              _id: "$customer._id",
              schedules: {
                $push: {
                  _id: "$_id",
                  items: {
                    $map: {
                      input: "$items",
                      as: "item",
                      in: {
                        $reduce: {
                          input: {
                            $map: {
                              input: "$ordered_gallons",
                              as: "order",
                              in: {
                                $cond: {
                                  if: { $eq: ["$$item.gallon", "$$order._id"] },
                                  then: {
                                    name: "$$order.name",
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
                  date: "$schedule",
                },
              },
              customer: { $first: "$customer" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ];

        const aggregation = Schedule.aggregate(pipeline);
        const data = await Schedule.aggregatePaginate(aggregation, options);
        return data;
      } catch (error) {
        console.log("error get schedules", error);
        throw error;
      }
    },
    getSchedulesAndSearchPending: async ({ search, page, limit, admin }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              // add match for approved
              accepted: false, // it should be true
              isCanceled: false,
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
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    display_photo: 1,
                    fullname: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                    type: "$customer_type",
                  },
                },
                {
                  $addFields: {
                    firstToLast: { $concat: ["$firstname", " ", "$lastname"] },
                    lastToFirst: { $concat: ["$lastname", " ", "$firstname"] },
                  },
                },

                {
                  $match:
                    search !== "null"
                      ? {
                          $or: [
                            { firstToLast: { $regex: search, $options: "i" } },
                            { lastToFirst: { $regex: search, $options: "i" } },
                          ],
                        }
                      : {},
                },
              ],
              as: "customer",
            },
          },
          {
            $match: {
              $expr: {
                $ne: ["$customer", []],
              },
            },
          },
          {
            $unwind: "$customer",
          },
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
                  },
                },
              ],
              as: "ordered_gallons",
            },
          },
          {
            $project: {
              _id: 1,
              items: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: {
                    $reduce: {
                      input: {
                        $map: {
                          input: "$ordered_gallons",
                          as: "order",
                          in: {
                            $cond: {
                              if: { $eq: ["$$item.gallon", "$$order._id"] },
                              then: {
                                name: "$$order.name",
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
              date: "$schedule",
              customer: "$customer",
            },
          },
          {
            $sort: {
              "date.utc_date": 1,
            },
          },
        ];
        const aggregation = Schedule.aggregate(pipeline);
        const data = await Schedule.aggregatePaginate(aggregation, options);
        return data;
      } catch (error) {
        throw error;
      }
    },
    getSchedulesAndSearchRejected: async ({ search, page, limit, admin }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              // add match for approved
              accepted: false, 
              isCanceled: true,
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
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    display_photo: 1,
                    fullname: {
                      $concat: ["$firstname", " ", "$lastname"],
                    },
                    type: "$customer_type",
                  },
                },
                {
                  $addFields: {
                    firstToLast: { $concat: ["$firstname", " ", "$lastname"] },
                    lastToFirst: { $concat: ["$lastname", " ", "$firstname"] },
                  },
                },

                {
                  $match:
                    search !== "null"
                      ? {
                          $or: [
                            { firstToLast: { $regex: search, $options: "i" } },
                            { lastToFirst: { $regex: search, $options: "i" } },
                          ],
                        }
                      : {},
                },
              ],
              as: "customer",
            },
          },
          {
            $match: {
              $expr: {
                $ne: ["$customer", []],
              },
            },
          },
          {
            $unwind: "$customer",
          },
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
                  },
                },
              ],
              as: "ordered_gallons",
            },
          },
          {
            $project: {
              _id: 1,
              items: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: {
                    $reduce: {
                      input: {
                        $map: {
                          input: "$ordered_gallons",
                          as: "order",
                          in: {
                            $cond: {
                              if: { $eq: ["$$item.gallon", "$$order._id"] },
                              then: {
                                name: "$$order.name",
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
              date: "$schedule",
              customer: "$customer",
            },
          },
          {
            $sort: {
              "date.utc_date": 1,
            },
          },
        ];
        const aggregation = Schedule.aggregate(pipeline);
        const data = await Schedule.aggregatePaginate(aggregation, options);
        return data;
      } catch (error) {
        console.log("errorerrorerror",error)
        throw error;
      }
    },
  };
};
