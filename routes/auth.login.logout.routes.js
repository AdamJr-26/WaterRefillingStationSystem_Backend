const router = require("express").Router();
const authController = require("../controllers/auth/index");
const validationUtil = require("../utils/validation.util");

const {authenticate} = require("../middlewares/passport.authenticate.middleware")
const {authenticateAdmin} = require("../middlewares/passport.authenticate.admin.middleware")

router.post("/login-admin", validationUtil.loginValidation, authController.loginAdmin);
router.post("/login/personel", authController.loginPersonel)


router.get("/logout/personel",authenticate ,authController.logoutPersonel)
router.use("/logout-admin",authenticateAdmin ,authController.logoutAdmin)
module.exports = {
    router
}
