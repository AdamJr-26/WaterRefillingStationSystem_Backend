module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getPayersCredits: async (req, res) => {
      const admin = getAdminId(req);
      const { limit, skip, from, to } = req.params;

      const { data, error } = await query.getPayersCredits({
        admin,
        limit,
        skip,
        from,
        to,
      });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get all customers history from paying debt",
          data,
          "get_credits_payers_history"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_credits_payers_history"
        );
      }
    },
    getCreditsReceiptsByCustomer: async (req, res) => {
      const admin = getAdminId(req);
      const { customer, from, to, skip, limit } = req.params;
      const { data, error } = await query.getCreditsReceiptsByCustomer({
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
          "credit histories",
          data,
          "get_credit_receipts"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "getting summary of a delivery failed, please try again",
          "get_credit_receipts"
        );
      }
    },
    getDebtPayments: async (req, res) => {
      try {
        const { page, limit, date } = req.params;
        const admin = getAdminId(req);
        const data = await query.getDebtPayments({ page, limit, date, admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "debt payments",
          data,
          "debt_payments"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "debt_payments"
        );
      }
    },
  };
};
