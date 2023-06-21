module.exports = (
  query,
  mutation,
  responseUtil,
  getAdminId,
  sendCancelationMesssage,
  format
) => {
  return {
    createSchedule: async (req, res) => {
      const admin = getAdminId(req);
      const { ...payload } = req.body;
      const { schedule: data, error } = await mutation.createSchedule({
        ...payload,
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "creating schedule",
          data,
          "create_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "create_schedule"
        );
      }
    },
    createScheduleByCustomer: async (req, res) => {
      try {
        // get admin id
        const customer = req.user._id;
        const payload = {
          customer,
          ...req.body,
        };
        console.log("payload=>>>>>>>>>>>", payload);
        const data = await mutation.createScheduleByCustomer({ payload });
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "creating schedule",
          data,
          "create_schedule"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          "Something went wrong, please try again.",
          "error"
        );
      }
    },
    checkIfcustomerHasSchedule: async (req, res) => {
      const admin = getAdminId(req);
      const { id } = req.params;
      const { data, error } = await query.checkIfcustomerHasSchedule({
        customer: id,
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "get schedule",
          data,
          "get_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_schedule"
        );
      }
    },
    getSchedulesByDate: async (req, res) => {
      // and by place
      const { date, place } = req.params;
      const admin = getAdminId(req);
      const { data, error } = await query.getSchedulesByDate({
        date,
        admin,
        place,
      });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get schedules",
          data,
          "get_schedules_by_date"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_schedules_by_date"
        );
      }
    },
    assignSchedule: async (req, res) => {
      const admin = getAdminId(req);
      const personel_id = req.user?._id;
      const { schedule_id } = req.body;
      // from transactions
      const { data, error } = await mutation.assignSchedule({
        admin,
        personel_id,
        schedule_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "assign schedule",
          data,
          "assign_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "assign_schedule"
        );
      }
    },
    getSchedulesAssignedToDelivery: async (req, res) => {
      const personel_id = req.user?._id;
      const payload = {
        personel_id,
      };
      const { data, error } = await query.getSchedulesAssignedToDelivery(
        payload
      );
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "assigend schedule",
          data,
          "get_assigend_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_assigend_schedule"
        );
      }
    },
    getAssignedScheduleByPersonel: async (req, res) => {
      const personel_id = req.user?._id;
      const payload = {
        personel_id,
      };
      const { data, error } = await query.getAssignedScheduleByPersonel(
        payload
      );
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "assigend schedule",
          data,
          "get_assigend_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_assigend_schedule"
        );
      }
    },
    reSchedule: async (req, res) => {
      const { schedule, schedule_id } = req.body; // schedule is a field in schedules document.
      const { data, error } = await mutation.reSchedule({
        schedule,
        schedule_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "assigend schedule",
          { message: "Create a new schedule successfully." },
          "get_assigend_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Cannot create a new schedule",
          "get_assigend_schedule"
        );
      }
    },
    deleteSchedule: async (req, res) => {
      const { schedule_id } = req.params;
      const { data, error } = await mutation.deleteSchedule({ schedule_id });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "delete schedule",
          { message: "Delete a schedule successfully." },
          "delete_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Cannot delete schedule",
          "delete_schedule"
        );
      }
    },
    rejectSchedule: async (req, res) => {
      const { id } = req.params;
      const { data, error } = await mutation.rejectSchedule({
        schedule_id: id,
      });
      if (data && !error) {
        // send email
        console.log("JSON.stringify(data)", JSON.stringify(data));
        await sendCancelationMesssage({
          receiver: data?.customer?.gmail,
          subject: "Rejected order",
          lastname: data?.customer?.lastname,
          wrs_name: data?.admin?.wrs_name,
          date_of_scheduled: format(
            new Date(data.schedule.utc_date),
            "MMM-dd-yyyy"
          ),
        });
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "delete schedule",
          { message: "Delete a schedule successfully." },
          "delete_schedule"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Cannot delete schedule",
          "delete_schedule"
        );
      }
    },
    acceptSchedule: async (req, res) => {
      try {
        const { id } = req.params;
        const admin = getAdminId(req);
        const data = await mutation.acceptSchedule({ id, admin });

        // send email to the customer.
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "update schedule",
          data,
          "accept_schedule"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "accept_schedule"
        );
      }
    },
    getSchedulesAndSearchApproved: async (req, res) => {
      try {
        const { search, page, limit } = req.params;
        const admin = getAdminId(req);
        const data = await query.getSchedulesAndSearchApproved({
          admin,
          search,
          page,
          limit,
        });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get schedules",
          data,
          "get_schedules"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "get_schedules"
        );
      }
    },
    getSchedulesAndSearchPending: async (req, res) => {
      try {
        const { search, page, limit } = req.params;
        const admin = getAdminId(req);
        const data = await query.getSchedulesAndSearchPending({
          admin,
          search,
          page,
          limit,
        });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get schedules",
          data,
          "get_schedules"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "get_schedules"
        );
      }
    },
    getSchedulesAndSearchRejected: async (req, res) => {
      try {
        const { search, page, limit } = req.params;
        const admin = getAdminId(req);
        const data = await query.getSchedulesAndSearchRejected({
          admin,
          search,
          page,
          limit,
        });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get schedules",
          data,
          "get_schedules_rejected1"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "get_schedules_rejected1"
        );
      }
    },
  };
};
