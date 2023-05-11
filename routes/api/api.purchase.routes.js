const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");




router.get(
  "/purchase/history/:limit/:page/:from/:to/:customer",
  authenticate,
  apiController.getPurchasesHistoryByCustomerId
);

router.get(
  "/purchases/:limit/:page/:date",
  authenticate,
  apiController.getPurchasesPaginate
);

module.exports = {
  router,
};
