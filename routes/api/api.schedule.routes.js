const router = require("express").Router();
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const apiController = require("../../controllers/api");

router.post("/new/schedule", authenticate, apiController.createSchedule);


router.get("/schedule/customer/:id", authenticate, apiController.checkIfcustomerHasSchedule)

router.get("/schedule/:date/:place", authenticate, apiController.getSchedulesByDate)

router.put("/schedule/assign", authenticate, apiController.assignSchedule)

router.get("/schedule-assigned/by-personel", authenticate, apiController.getAssignedScheduleByPersonel )

router.post("/re-schedule", authenticate, apiController.reSchedule)

router.put("/schedule/remove/assigned/:schedule_id", authenticate, apiController.removeAssignedSchedule)

router.delete("/schedule/:schedule_id", authenticate, apiController.deleteSchedule)

module.exports = { router };
