const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/credits/history/pagination/:limit/:skip/:from/:to",
  authenticate,
  apiController.getPayersCredits
);
router.get(
  "/customer-credit/history/:limit/:skip/:from/:to/:customer",
  authenticate,
  apiController.getCreditsReceiptsByCustomer
);
module.exports = { router };
