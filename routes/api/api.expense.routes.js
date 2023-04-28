const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/expense", authenticate, apiController.createNewReportExpense);
router.get(
  "/expenses/:limit/:page/:date",
  authenticate,
  apiController.getExpensesPaginated
);
module.exports = { router };
