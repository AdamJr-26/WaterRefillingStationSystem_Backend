const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/cart", authenticate, apiController.addToCart);

router.get("/cart",authenticate, apiController.getCart)

module.exports = { router };
