module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getSummaryOfDeliveryFromPurchases: async (req, res) => {
      const { delivery_id } = req.params;
      const admin = getAdminId(req);
      const { data, error } = await query.getSummaryOfDeliveryFromPurchases({
        delivery_id,
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "summary of a delivery",
          data,
          "summary_of_delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "getting summary of a delivery failed, please try again",
          "summary_of_delivery"
        );
      }
    },
  };
};
