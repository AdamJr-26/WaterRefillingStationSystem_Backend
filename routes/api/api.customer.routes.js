const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const attachmentsUpload = require("../../middlewares/multer.middleware");
const upload = attachmentsUpload();

const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/customer/wrs", authenticate,  upload.array("image"),apiController.createCustomer)

module.exports = { router };
