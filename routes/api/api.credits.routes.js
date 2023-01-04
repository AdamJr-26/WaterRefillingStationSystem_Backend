const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get("/credits/params/:customer", authenticate, apiController.getTotalDebt);

router.get("/all/credits/:customer_id",authenticate, apiController.getCustomerCredits)

module.exports = { router };
