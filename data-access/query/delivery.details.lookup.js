const mongoose = require("mongoose");
module.exports = (Schedule) => {
  return {
    getScheduleDetails: async ({ admin, schedule_id }) => {
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
