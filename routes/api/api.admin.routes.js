const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get("/admin/basic-info", authenticate, apiController.getAdminBasicInfo);

module.exports = { router };
