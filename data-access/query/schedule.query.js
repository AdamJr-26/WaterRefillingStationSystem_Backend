const mongoose = require("mongoose");

module.exports = (Schedule, endOfDay, startOfDay) => {
  return {
    checkIfcustomerHasSchedule: async (payload) => {
      try {
        const filter = {
          customer: payload?.customer?.toString(),
          admin: payload?.admin?.toString(),
        };
        const data = await Schedule.find(filter).exec();
        console.log("schedules dataaaaaaaa", data);
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAssignedScheduleByPersonel: async (payload) => {
      try {
        const filter = {
          assigned: true,
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
      console.log("placeplaceplace", place);
      try {
        const pipelines = [
          {
            //para imatch sa documents
            $match: {
              assigned: false,
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
                { $match: { $expr: { $eq: ["$address.barangay", place] } } },
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
  };
};
