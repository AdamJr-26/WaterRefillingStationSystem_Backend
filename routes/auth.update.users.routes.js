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

module.exports = {
  router,
};
