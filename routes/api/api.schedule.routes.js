const router = require("express").Router();
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const apiController = require("../../controllers/api");

router.post("/new/schedule", authenticate, apiController.createSchedule);

// check if customer has schedule -> true or false;
router.get("/schedule/customer/:id", authenticate, apiController.checkIfcustomerHasSchedule)

router.get("/schedule/:date/:place", authenticate, apiController.getSchedulesByDate)

router.put("/schedule/assign", authenticate, apiController.assignSchedule)

router.get("/schedule-assigned/by-personel", authenticate, apiController.getAssignedScheduleByPersonel )

module.exports = { router };
