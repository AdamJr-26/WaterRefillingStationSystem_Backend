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

module.exports = {
  router,
};
