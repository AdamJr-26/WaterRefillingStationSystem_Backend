const router = require("express").Router();
const {
  authenticate,
} = require("../middlewares/passport.authenticate.middleware");
const authController = require("../controllers/auth/index");
router.post(
  "/update-admin-password",
  authenticate,
  authController.updateAdminPassword
);

// forgot password for admin
router.post("/reset-password/request", authController.sendResetVerifyLink);
// set new password for admin
router.post("/reset-password/set-new-password", authController.setNewPassWordAdmin)
module.exports = {
  router,
};
