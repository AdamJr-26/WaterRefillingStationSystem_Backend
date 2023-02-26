const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/send/sms/:recipient",
  apiController.sendDeliveryNotification
);

module.exports = {
  router,
};
