module.exports = (query, mutation, responseUtil, getAdminId) => {
  return {
    createDiscount: async (req, res) => {
      const discount = req.body;
      const admin = getAdminId(req);
      const payload = {
        admin,
        get_free: discount,
      };
      const { data, error } = await mutation.createDiscount({ payload });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "Create discount",
          data,
          "create_discount"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "create discount failed, please try again",
          "create_discount"
        );
      }
    },
    getDiscountsByGetFree: async (req, res) => {
      const admin = getAdminId(req);
      const { data, error } = await query.getDiscountsByGetFree(admin);
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get free discounts",
          data,
          "get_get_free_discounts"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get free discounts failed, please try again",
          "get_get_free_discounts"
        );
      }
    },
  };
};
