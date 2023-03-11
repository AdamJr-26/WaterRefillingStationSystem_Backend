const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

// get all nearby station
router.get(
  "/stations/nearby/:lng/:lat",
  authenticate,
  apiController.getNearbyStation
);


module.exports = {
  router,
};
