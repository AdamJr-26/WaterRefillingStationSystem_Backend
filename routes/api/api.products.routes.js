const router = require("express").Router();
const apiController = require("../../controllers/api/index");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.post("/product", authenticate, apiController.addProductToShop);

router.get("/products", authenticate, apiController.getProducts);

router.get(
  "/products/from-customer/:admin",
  authenticate,
  apiController.getProductsFromCustomer
);
module.exports = {
  router,
};
