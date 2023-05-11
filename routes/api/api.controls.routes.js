const router = require("express").Router();
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const apiController = require("../../controllers/api");

router.put("/controls", authenticate, apiController.updateControls);

router.get("/controls", authenticate, apiController.getControls);

module.exports = { router };
