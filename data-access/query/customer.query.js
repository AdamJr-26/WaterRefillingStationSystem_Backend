const mongoose = require("mongoose");

module.exports = (Customer) => {
  return {
    getCustomerByFirstname: async (payload) => {
      try {
        const filter = {
          firstname: { $regex: payload?.searchText, $options: "i" },
        };
        const data = await Customer.find(filter).limit(5).exec(); // nag add ako ng password para sa future kung magkaroon ng customer that haas password.
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getCustomersPlaces: async (payload) => {
      try {
        const field = payload?.place;
        const query = { admin: payload?.admin };
        const data = await Customer.distinct(field, query);
        return { data };
      } catch (error) {
        return { error };
      }
    },
    searchCustomerByNameAndPlace: async ({ search_text, admin }) => {
      try {
        const stages = [
          {
            $search: {
              index: "customer",
              text: {
                query: search_text,
                path: {
                  wildcard: "*",
                },
              },
            },
          },
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
            },
          },
          {
            $limit: 10,
          },
        ];
        const data = await Customer.aggregate(stages);
        return { data };
      } catch (error) {
        console.log("sdfsdfsdf", error);
        return { error };
      }
    },
    getCustomersStatus: async ({
      admin,
      skip,
      limit,
      search,
      sort,
      exists_only,
    }) => {
      try {
        // create search.
        // sort by
        //
        console.log("exists_only", exists_only);
        const match =
          search != "null"
            ? [
                {
                  $search: {
                    index: "customer",
                    text: {
                      query: search,
                      path: {
                        wildcard: "*",
                      },
                    },
                  },
                },
                {
                  $match: {
                    admin: mongoose.Types.ObjectId(admin),
                  },
                },
              ]
            : [
                {
                  $match: {
                    admin: mongoose.Types.ObjectId(admin),
                  },
                },
              ];

        const pipeline = [
          ...match,
          {
            $project: {
              display_photo: 1,
              firstname: 1,
              lastname: 1,
              mobile_number: 1,
              customer_type: 1,
              address: 1,
              _id: 1,
            },
          },
          {
            $lookup: {
              from: "credits",
              localField: "_id",
              foreignField: "customer",
              pipeline: [
                {
                  $group: {
                    _id: "$customer",
                    total_credit_amount: {
                      $sum: { $sum: { $multiply: ["$price", "$total"] } },
                    },
                    total_credited_gallon: {
                      $sum: { $sum: "$total" },
                    },
                  },
                },
              ],
              as: "credit",
            },
          },
          {
            $lookup: {
              from: "borrows",
              localField: "_id",
              foreignField: "customer",
              pipeline: [
                {
                  $group: {
                    _id: "$customer",
                    total_borrowed_gallon: {
                      $sum: { $sum: "$total" },
                    },
                  },
                },
              ],
              as: "borrow",
            },
          },
          {
            $lookup: {
              from: "schedules",
              localField: "_id",
              foreignField: "customer",
              pipeline: [
                {
                  $sort: {
                    "schedule.unix_timestamp": -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    schedule: 1,
                  },
                },
              ],
              as: "schedules",
            },
          },
          {
            $lookup: {
              from: "purchases",
              localField: "_id",
              foreignField: "customer",
              pipeline: [
                {
                  $sort: {
                    "date.unix_timestamp": -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    date: 1,
                  },
                },
              ],
              as: "last_delivery",
            },
          },
          {
            $match: {
              [exists_only]: { $exists: true, $ne: null, $ne: 0 },
            },
          },
          {
            $sort: { [sort]: 1 },
          },
          {
            $skip: Number(skip),
          },

          {
            $limit: Number(limit),
          },
        ];
        const data = await Customer.aggregate(pipeline);
        return { data };
      } catch (error) {
        console.log("error", error);
        return { error };
      }
    },
  };
};
