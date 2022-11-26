
const router = require("express").Router();
const authController = require("../../controllers/auth/index");

router.get("/verify-admin", authController.verifyAdmin);
router.post("/verify/personel", authController.verifyPersonel)
module.exports = {
    router
}