const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const attachmentsUpload = require("../../middlewares/multer.middleware");
const upload = attachmentsUpload();

const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/customer/wrs", authenticate,  upload.array("image"),apiController.createCustomer)

router.get("/customer/by-firstname/:search", authenticate, apiController.getCustomerByFirstname)

router.get("/customer/distinct/places", authenticate, apiController.getCustomersPlaces)

module.exports = { router };
