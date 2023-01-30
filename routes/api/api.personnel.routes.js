const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const attachmentsUpload = require("../../middlewares/multer.middleware");
const upload = attachmentsUpload();

const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.put(
  "/personel/apply-id",
  authenticate,
  apiController.personelAcceptApplyId
);

router.put(
  "/personel/display-photo",
  authenticate,
  upload.array("image"),
  apiController.updatePersonelProfilePicture
);

router.get(
  "/personnel/sales/achievements/:date/:top",
  authenticate,
  apiController.getPersonnelsSalesAchievements
);

module.exports = {
  router,
};
