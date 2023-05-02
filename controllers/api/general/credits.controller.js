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
    getAllCreditsAccountReceivable: async (req, res) => {
      const admin = getAdminId(req);

      const { data, error } = await query.getAllCreditsAccountReceivable({
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get all customers account receivable",
          data,
          "get_account_receivable"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_account_receivable"
        );
      }
    },
    getCreditsByPaginationAndDate: async (req, res) => {
      const admin = getAdminId(req);
      const { limit, page, from, to } = req.params;
      const { data, error } = await query.getCreditsByPaginationAndDate({
        admin,
        limit,
        page,
        from,
        to,
      });
      
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get all customers account receivable",
          data,
          "get_account_receivable"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_account_receivable"
        );
      }
    },
    getCreditInfo: async (req, res) => {
      const admin = getAdminId(req);
      const { customer_id, credit_id } = req.params;
      
      const { data, error } = await query.getCreditInfo({
        admin,
        customer_id,
        credit_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get credit info",
          data,
          "get_credit_info"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_credit_info"
        );
      }
    },
  };
};
