module.exports = (Schedule) => {
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
  };
};
