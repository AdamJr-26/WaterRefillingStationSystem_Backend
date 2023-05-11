const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/sell-container", authenticate, apiController.sellContainer);

router.get(
  "/sold-containers/:limit/:page/:date",
  authenticate,
  apiController.getSoldContainers
);

module.exports = {
  router,
};
