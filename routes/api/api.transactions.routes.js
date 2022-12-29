const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/deliver/orders", authenticate, apiController.deliverOrder)

module.exports = {
  router,
};
