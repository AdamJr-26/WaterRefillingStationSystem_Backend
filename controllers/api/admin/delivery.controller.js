module.exports = (query, mutation, transaction, responseUtil, getAdminId) => {
  return {
    getPopulatedDeliveries: async (req, res) => {
      const admin = getAdminId(req);
      const { data, error } = await query.getPopulatedDeliveries({
        admin: admin,
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
      console.log("isSuccesssssssssssss")
      const payload = req.body;
      const isapproved = await transaction.acceptDelivery(payload);
     
    },
  };
};
