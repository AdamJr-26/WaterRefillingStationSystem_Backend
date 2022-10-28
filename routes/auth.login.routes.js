const router = require("express").Router();
const authController = require("../controllers/auth/index");
const validationUtil = require("../utils/validation.util");

router.post("/login-admin", validationUtil.loginValidation, authController.loginAdmin);


module.exports = {
    router
}