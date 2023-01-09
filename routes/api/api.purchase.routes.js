const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");


router.get(
  "/delivery/summary/:delivery_id",
  authenticate,
  apiController.getSummaryOfDeliveryFromPurchases
);

module.exports = {
  router,
};
