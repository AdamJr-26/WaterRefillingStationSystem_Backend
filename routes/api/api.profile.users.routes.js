const router = require("express").Router();
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const apiController = require("../../controllers/api");

router.get("/admin/profile", authenticate, apiController.getAdminProfile);

router.get(
  "/delivery-personel/profile",
  authenticate,
  apiController.getPersonelProfile
);

module.exports = { router };
