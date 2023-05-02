const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

// post
router.post("/delivery", authenticate, apiController.createDelivery); //

// get
router.get(
  "/deliveries/pending",
  authenticate,
  apiController.getPopulatedDeliveries
);
router.get(
  "/delivery/by-personel",
  authenticate,
  apiController.getPersonelDelivery
);
//update
router.put("/delivery", authenticate, apiController.acceptDelivery);

router.put(
  "/delivery/cancel/:delivery_id",
  authenticate,
  apiController.cancelDelivery
);

router.put(
  "/delivery/finish/:delivery_id",
  authenticate,
  apiController.finishDelivery
);

router.get(
  "/deliveries/recent",
  authenticate,
  apiController.getRecentDeliveries
);
router.get(
  "/deliveries/ongoing/:limit/:page",
  authenticate,
  apiController.getOngoingDeliveries
);

router.get(
  "/deliveries/finished/:limit/:page",
  authenticate,
  apiController.getFinishedDeliveries
);
module.exports = {
  router,
};
