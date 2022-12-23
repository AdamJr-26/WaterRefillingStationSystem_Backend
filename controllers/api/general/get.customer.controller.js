module.exports = (query, responseUtil, getAdminId) => {
  return {
    getCustomerByFirstname: async (req, res) => {
      const { search } = req.params;
      const customer = await query.getCustomerByFirstname({
        searchText: search,
      });
      if (customer?.data && !customer?.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetching customer",
          customer?.data,
          "customer"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get customer failed, please try again",
          "customer"
        );
      }
    },
    getCustomersPlaces: async (req, res) => {
      const admin = getAdminId(req);
      const { data, error } = await query.getCustomersPlaces({
        admin,
        place: "address.barangay",
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetching customer",
          data,
          "customers_distinct_address"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get customer failed, please try again",
          "customers_distinct_address"
        );
      }
    },
  };
};
