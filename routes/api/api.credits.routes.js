const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/credits/params/:customer",
  authenticate,
  apiController.getTotalDebt
);

router.get(
  "/all/credits/:customer_id",
  authenticate,
  apiController.getCustomerCredits
);

router.put(
  "/credits/pay/:credit_id",
  authenticate,
  apiController.payCreditPerGallon
);

router.get(
  "/credits/account-receivable",
  authenticate,
  apiController.getAllCreditsAccountReceivable
);

router.get(
  "/credits/pagination/:limit/:skip/:from/:to",
  authenticate,
  apiController.getCreditsByPaginationAndDate
);

router.get(
  "/credit/info/:credit_id/:customer_id",
  authenticate,
  apiController.getCreditInfo
);

module.exports = { router };
