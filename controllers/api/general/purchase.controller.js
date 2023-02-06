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
    getPurchasesHistoryByCustomerId: async (req, res) => {
      const admin = getAdminId(req);
      const { customer, from, to, skip, limit } = req.params;
      const { data, error } = await query.getPurchasesHistoryByCustomerId({
        admin,
        customer,
        from,
        to,
        skip,
        limit,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "purchase histories",
          data,
          "get_customer_purchases"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "getting summary of a delivery failed, please try again",
          "get_customer_purchases"
        );
      }
    },
  };
};
