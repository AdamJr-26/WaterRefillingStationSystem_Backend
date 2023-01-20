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

module.exports = { router };
