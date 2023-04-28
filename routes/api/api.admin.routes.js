const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const attachmentsUpload = require("../../middlewares/multer.middleware");
const upload = attachmentsUpload();

router.get("/admin/basic-info", authenticate, apiController.getAdminBasicInfo);

router.put(
  "/admin/profile",
  authenticate,
  upload.array("image"),
  apiController.updateProfile
);

module.exports = { router };
