const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");
const attachmentsUpload = require("../../middlewares/multer.middleware");

const upload = attachmentsUpload();
// POST
router.post(
  "/gallon",
  authenticate,
  upload.array("image"),
  apiController.addGallon
);

router.post(
  "/vehicle",
  authenticate,
  upload.array("image"),
  apiController.addVehicle
);

// GET
router.get("/gallons/:limit/:page", authenticate, apiController.getAllGallons);

router.get(
  "/gallons/availables",
  authenticate,
  apiController.getAvailableGallons
);
router.get("/vehicles/:limit/:page", authenticate, apiController.getVehicles);

router.get(
  "/vehicles/available",
  authenticate,
  apiController.getAvailableVehicles
);

router.get("/gallon/:id/:admin", authenticate, apiController.getGallon);

// update
router.put(
  "/gallon/price/:id/:admin",
  authenticate,
  apiController.updateGallonPrice
);
router.put(
  "/gallon/add/:id/:admin",
  authenticate,
  apiController.updateAddCountGallon
);
router.put(
  "/gallon/reduce/:id/:admin",
  authenticate,
  apiController.updateReduceCountGallon
);

// get all gallons that not in products collection.
router.get(
  "/gallons/not-in-products",
  authenticate,
  apiController.getAllGallonsNotInProducts
);
module.exports = {
  router,
};
