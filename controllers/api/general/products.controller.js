module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    addProductToShop: async (req, res) => {
      // add product
      try {
        const admin = getAdminId(req);
        const payload = {
          admin: admin,
          gallon: req.body.gallon,
          price: req.body.price,
        };
        const data = await mutation.addProductToShop(payload);

        responseUtil.generateServerResponse(
          res,
          200,
          "Success",
          "Adding product",
          data,
          "add_product"
        );
      } catch (error) {
        console.log("error", error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "add_product"
        );
      }
    },
    getProducts: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const data = await query.getProducts({ admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "Success",
          "Fetching products",
          data,
          "get_products"
        );
      } catch (error) {
        console.log("error", error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "get_products"
        );
      }
    },
    getProductsFromCustomer: async (req, res) => {
      try {
        const { admin } = req.params;
        const data = await query.getProductsFromCustomer({ admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "Success",
          "Fetching products",
          data,
          "get_products_as_customer"
        );
        console.log("data", data);
      } catch (error) {
        console.log("error", error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "get_products_as_customer"
        );
      }
    },
    deleteProducts: async (req, res) => {
      try {
        const { id } = req.params;
        const data = await mutation.deleteProducts({ id });
        responseUtil.generateServerResponse(
          res,
          200,
          "Success",
          "Remove products from shop successfully",
          data,
          "delete_products"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "delete_products"
        );
      }
    },
  };
};
