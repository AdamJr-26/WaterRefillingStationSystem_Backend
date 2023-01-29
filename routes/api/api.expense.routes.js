const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/expense", authenticate, apiController.createNewReportExpense);
module.exports = { router };
