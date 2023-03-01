const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/dashboard/todays-progress/:date",
  authenticate,
  apiController.getTodaysCashTransaction
);
module.exports = { router };
