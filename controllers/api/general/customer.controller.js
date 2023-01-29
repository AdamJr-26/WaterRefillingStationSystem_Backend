module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    searchCustomerByFirstnamePlace: async (req, res) => {
      const { search_text } = req.params;
      console.log("customer_name", search_text);
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
      const { limit, skip, search, sort, exists_only } = req.params;
      const { data, error } = await query.getCustomersStatus({
        admin,
        limit,
        skip,
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
  };
};
