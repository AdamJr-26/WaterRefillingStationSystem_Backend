
const router = require("express").Router();
const authController = require("../../controllers/auth/index");

router.get("/verify-admin", authController.verifyAdmin);
router.post("/verify/personel", authController.verifyPersonel)
router.post("/resend-otp", authController.sendOTP)
module.exports = {
    router
}