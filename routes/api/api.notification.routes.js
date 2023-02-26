const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/send/delivery-notification/:schedule_id",
  authenticate,
  apiController.sendEmailToNotifyCustomerForDelivery
);

module.exports = {
  router,
};
