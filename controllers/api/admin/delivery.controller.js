module.exports = (query, mutation, transaction, responseUtil, getAdminId) => {
  return {
    getPopulatedDeliveries: async (req, res) => {
      const admin = getAdminId(req);
      const isApproved = false
      const { data, error } = await query.getPopulatedDeliveries({
        admin: admin,
        isApproved
      });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get deliveries",
          data,
          "deliveries"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "deliveries"
        );
      }
    },

    acceptDelivery: async (req, res) => {
      const admin = getAdminId(req);
      const payload = req.body;
      const { success, error } = await transaction.acceptDelivery(payload);
      if (success && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "accept request delivery successfully",
          success,
          "accept delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "accept delivery"
        );
      }
    },
  };
};
