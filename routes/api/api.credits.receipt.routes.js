const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/credits/history/pagination/:limit/:page/:from/:to",
  authenticate,
  apiController.getPayersCredits
);
router.get(
  "/customer-credit/history/:limit/:page/:from/:to/:customer",
  authenticate,
  apiController.getCreditsReceiptsByCustomer
);
router.get("/debt-payments/:limit/:page/:date", authenticate, apiController.getDebtPayments)
module.exports = { router };
