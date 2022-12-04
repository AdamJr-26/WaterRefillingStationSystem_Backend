const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/delivery", authenticate, apiController.createDelivery); //
router.get("/deliveries", authenticate, apiController.getPopulatedDeliveries);
router.put("/delivery", apiController.acceptDelivery);
module.exports = {
  router,
};
