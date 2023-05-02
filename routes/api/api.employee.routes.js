const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/employee/personel/apply-id", authenticate, apiController.createApplyID); // 

router.get("/delivery-personnels/:limit/:page", authenticate, apiController.getPersonels) 


module.exports = {
  router,
};
