const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.put(
  "/personel/apply-id",
  authenticate,
  apiController.personelAcceptApplyId
);

module.exports = {
  router,
};
