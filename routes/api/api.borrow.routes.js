const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/borrowed/total/gallon/:customer_id",
  authenticate,
  apiController.getTotalOfBorrowedGallon
);

router.get(
  "/borrowed/gallons/:customer_id",
  authenticate,
  apiController.getBorrowedGallonsByCustomer
);

router.put("/borrow/return/:borrow_id/:gallon_id", authenticate,apiController.returnGallon)

module.exports = { router };
