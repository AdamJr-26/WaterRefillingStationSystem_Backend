const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/credit-limit", authenticate, apiController.createCreditLimit);
router.delete("/credit-limit/:id", authenticate, apiController.deleteCreditLimit);
router.get("/credit-limit", authenticate, apiController.getCreditLimits);

module.exports = { router };
