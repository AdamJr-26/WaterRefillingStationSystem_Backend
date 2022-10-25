const router = require("express").Router();
const apiController = require("../controllers/api/index");

router.post("/check/admin-gmail-exists",apiController.checkAdminEmail)

module.exports = { router };

