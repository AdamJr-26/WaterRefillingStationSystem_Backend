const router = require("express").Router();
const {
  authenticate,
} = require("../middlewares/passport.authenticate.middleware");
const {authenticateAdmin} = require("../middlewares/passport.authenticate.admin.middleware")

const authController = require("../controllers/auth/index");
router.post(
  "/update-admin-password",
  authenticateAdmin,
  authController.updateAdminPassword
);

// forgot password for admin
router.post("/reset-password/request", authController.sendResetVerifyLink);
// set new password for admin
router.post("/reset-password/set-new-password", authController.setNewPassWordAdmin)

// personel
router.post("/send-otp/personel", authController.sendOTP)
router.post("/verify-top/personel",authController.verifyOTP)
router.post("/new-password/personel", authController.setNewPasswordPersonel)
module.exports = {
  router,
};
