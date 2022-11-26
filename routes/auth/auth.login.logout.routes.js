const router = require("express").Router();
const authController = require("../../controllers/auth/index");
const validationUtil = require("../../utils/validation.util");

const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post(
  "/login-admin",
  validationUtil.loginValidation,
  authController.loginAdmin
);
router.post("/login/personel", authController.loginPersonel);

router.get("/logout/personel", authenticate, authController.logoutPersonel);
router.use("/logout-admin", authenticate, authController.logoutAdmin);
module.exports = {
  router,
};
