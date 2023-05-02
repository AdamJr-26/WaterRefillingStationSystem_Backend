const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/return/history/:limit/:page/:from/:to/:customer",
  authenticate,
  apiController.getReturnReceipts
);

module.exports = {
  router,
};
