const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const attachmentsUpload = require("../../middlewares/multer.middleware");
const upload = attachmentsUpload();

const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post(
  "/customer/wrs",
  authenticate,
  upload.array("image"),
  apiController.createCustomer
);

router.get(
  "/customer/by-firstname/:search",
  authenticate,
  apiController.getCustomerByFirstname
);

router.get(
  "/customer/distinct/places",
  authenticate,
  apiController.getCustomersPlaces
);

router.get(
  "/search/customers/:search_text",
  authenticate,
  apiController.searchCustomerByFirstnamePlace
);

router.get(
  "/customers/status/borrowed/credits/lastdelivery/:limit/:skip/:search/:sort/:exists_only",
  authenticate,
  apiController.getCustomersStatus
);

//  routes that customer have accesses
router.get(
  "/customers/profile",
  authenticate,
  apiController.getCustomerProfile
);
router.put("/customer/address", authenticate, apiController.updateCustomerAddress);

module.exports = { router };
