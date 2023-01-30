const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/reports/purchases/:date",
  authenticate,
  apiController.getPurchasesReport
);

module.exports = {
  router,
};
