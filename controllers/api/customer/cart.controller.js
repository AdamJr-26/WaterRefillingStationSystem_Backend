module.exports = (query, mutation, responseUtil) => {
  return {
    addToCart: async (req, res) => {
      try {
        const body = req.body;
        const customer = req.user._id;
        const payload = {
          admin: body.admin,
          gallon: body.gallon,
          customer: customer,
        };
        const data = await mutation.addToCart({ payload });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "add to cart",
          data,
          "error"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "error"
        );
      }
    },
    getCart: async (req, res) => {
      try {
        const customer = req.user._id;
        const data = await query.getCart({ customer });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get all cart",
          data,
          "error"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "error"
        );
      }
    },
  };
};
