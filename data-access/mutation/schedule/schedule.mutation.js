const mongoose = require("mongoose");
module.exports = (db, Schedule) => {
  return {
    createSchedule: async (payload) => {
      try {
        const schedule = new Schedule(payload);
        await schedule.save((error) => {
          if (error) {
            throw new Error("[create schedule]", error);
          }
        });
        return { schedule };
      } catch (error) {
        return { error };
      }
    },
    assignSchedule: async ({ admin, personel_id, schedule_id }) => {
      try {
        const filter = {
          _id: schedule_id,
          admin: admin,
        };
        const update = {
          $set: { assigned_to: personel_id, assigned: true }, //personel_id -> delivery personel
        };
        const data = await Schedule.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        })
          .select(["admin", "_id", "assigned_to", "assigned"])
          .exec();
        await data.save((err) => {
          if (err) throw new Error("[Error]", err);
        });
        return { data };
      } catch (error) {
        return { error };
      }
    },
    reSchedule: async ({ schedule, schedule_id }) => {
      const session = await db.startSession();
      try {
        session.startTransaction();
        // bad implementation? : coz got 3 request to the mongodb server.
        const stages = [
          {
            $match: {
              _id: mongoose.Types.ObjectId(schedule_id),
            },
          },
          {
            $project: {
              _id: 0,
              items: "$items",
              admin: "$admin",
              customer: "$customer",
              order_by: "$order_by",
              schedule: schedule,
            },
          },
        ];

        const sched = await Schedule.aggregate(stages);
        console.log("sched", sched);
        const data = await new Schedule(sched[0]);

        await data.save((error) => {
          if (error) throw new Error("Error rescheduling");
        });

        const deleted_schedule = await Schedule.findOneAndDelete({
          _id: schedule_id,
        })
          .select(["_id"])
          .exec();
        console.log("deleted_schedule", deleted_schedule);

        console.log("[SCHEDLUES]", data);
        return { data };
      } catch (error) {
        console.log("errorrrrrr", error);
        await session.abortTransaction();
        session.endSession();
        return { error };
      }
    },
    removeAssignedSchedule: async ({ schedule_id }) => {
      try {
        const filter = {
          _id: schedule_id,
        };
        const update = {
          assigned: false,
          $unset: { assigned_to: "" },
        };
        const data = await Schedule.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        })
          .select(["_id"])
          .exec();
        return { data };
      } catch (error) {
        console.log("errorerror", error);
        return { error };
      }
    },
    deleteSchedule: async ({ schedule_id }) => {
      try {
        const data = await Schedule.findOneAndDelete({
          _id: schedule_id,
        })
          .select(["_id"])
          .exec();
        if (data?._id) {
          return { data };
        } else {
          throw new Error("No schedule were find.");
        }
      } catch (error) {
        return { error };
      }
    },
  };
};
