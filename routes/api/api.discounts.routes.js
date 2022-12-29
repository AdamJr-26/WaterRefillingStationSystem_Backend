const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/discount/get-free", authenticate, apiController.createDiscount);

router.get(
  "/discounts/get-free",
  authenticate,
  apiController.getDiscountsByGetFree
);
module.exports = {
  router,
};
