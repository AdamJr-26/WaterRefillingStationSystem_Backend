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

router.get(
  "/purchase/history/:limit/:skip/:from/:to/:customer",
  authenticate,
  apiController.getPurchasesHistoryByCustomerId
);

router.get(
  "/purchases/:limit/:page/:date",
  authenticate,
  apiController.getPurchasesPaginate
);

module.exports = {
  router,
};
