module.exports = (query, mutation, transaction, getAdminId, responseUtil) => {
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
    payCreditPerGallon: async (req, res) => {
      const admin = getAdminId(req);
      const { credit_id } = req.params;
      const payload = req.body;
      console.log("ddd", { credit_id, admin, payload });
      const { data, error } = await transaction.payCreditPerGallon({
        admin,
        credit_id,
        payload,
      });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "pay customer credits",
          data,
          "pay_credit_per_gallon"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "pay_credit_per_gallon"
        );
      }
    },
  };
};
