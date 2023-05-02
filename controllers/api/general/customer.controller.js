module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    searchCustomerByFirstnamePlace: async (req, res) => {
      const { search_text } = req.params;

      const admin = getAdminId(req);
      const { data, error } = await query.searchCustomerByNameAndPlace({
        search_text,
        admin: admin.toString(),
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get customers",
          data,
          "get_customers"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get customers failed, please try again",
          "get_customers"
        );
      }
    },
    getCustomersStatus: async (req, res) => {
      const admin = getAdminId(req);
      const { limit, page, search, sort, exists_only } = req.params;
      const { data, error } = await query.getCustomersStatus({
        admin,
        limit,
        page,
        search,
        sort,
        exists_only,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get customers",
          data,
          "get_customers"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get customers failed, please try again",
          "get_customers"
        );
      }
    },
    // client/customer access
    getCustomerProfile: async (req, res) => {
      try {
        const user = req.user;
        const data = await query.getCustomerProfile({ id: user.id });

        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get customer's profile",
          data,
          "profile"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get customer's profile failed, please try again",
          "profile"
        );
      }
    },
    updateCustomerAddress: async (req, res) => {
      try {
        const updatePayload = req.body;
        const gmail = req.user.gmail;
        const data = await mutation.customerUpdateAddress({
          gmail,
          updatePayload,
        });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "updated address",
          data,
          "profile"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "profile"
        );
      }
    },
    subscribeCustomer: async (req, res) => {
      try {
        const gmail = req.user.gmail;
        const admin = req.body.admin;
        const data = await mutation.subscribeCustomer({ gmail, admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "subscribe to wrs",
          data,
          "subscribe"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "subscribe"
        );
      }
    },
  };
};
