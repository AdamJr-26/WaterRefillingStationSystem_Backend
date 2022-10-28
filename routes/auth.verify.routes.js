
const router = require("express").Router();
const authController = require("../controllers/auth/index");

router.get("/verify-admin", authController.verifyAdmin);

module.exports = {
    router
}