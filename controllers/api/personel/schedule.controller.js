module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    removeAssignedSchedule: async (req, res) => {
      const { schedule_id } = req.params;
      const { data, error } = await mutation.removeAssignedSchedule({
        schedule_id,
      });
      console.log('schedule_id',JSON.stringify(schedule_id))
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "You just removed assigned schedule.",
          { data: data?._id },
          "remove_assigned_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "remove_assigned_schedule"
        );
      }
    },
    getOutdatedSchedules: async (req, res) => {
      const admin = getAdminId(req);
      const { data, error } = await query.getOutdatedSchedules({
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get outdaetd schedules",
          data,
          "outdated_schedules"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "outdated_schedules"
        );
      }
    },
  };
};
