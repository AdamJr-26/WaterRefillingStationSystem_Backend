const router = require("express").Router();
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const apiController = require("../../controllers/api");

router.post("/new/schedule", authenticate, apiController.createSchedule);

// this route is for customer use.
router.post(
  "/schedle/by-customer",
  authenticate,
  apiController.createScheduleByCustomer
);

router.get(
  "/schedule/customer/:id",
  authenticate,
  apiController.checkIfcustomerHasSchedule
);

router.get(
  "/schedule/:date/:place",
  authenticate,
  apiController.getSchedulesByDate
);

router.put("/schedule/assign", authenticate, apiController.assignSchedule);

router.get(
  "/schedule-assigned/by-personel",
  authenticate,
  apiController.getAssignedScheduleByPersonel
);

router.post("/re-schedule", authenticate, apiController.reSchedule);

router.put(
  "/schedule/remove/assigned/:schedule_id",
  authenticate,
  apiController.removeAssignedSchedule
);

router.delete(
  "/schedule/:schedule_id",
  authenticate,
  apiController.deleteSchedule
);

router.get(
  "/schedules/outdated",
  authenticate,
  apiController.getOutdatedSchedules
);

module.exports = { router };
