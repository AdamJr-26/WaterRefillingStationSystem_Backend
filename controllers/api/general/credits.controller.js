module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getTotalDebt: async (req, res) => {
      const admin = getAdminId(req);
      const { customer } = req.params;
      const { data, error } = await query.getTotalDebt({ admin, customer });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "customer balance",
          data,
          "get_customer_balance"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_customer_balance"
        );
      }
    },
    getCustomerCredits: async (req, res) => {
      const { customer_id } = req.params;
      const admin_id = getAdminId(req);
      const { data, error } = await query.getCustomerCredits({
        admin_id,
        customer_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "customer credits",
          data,
          "get_credits"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_credits"
        );
      }
    },
  };
};
