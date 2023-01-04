module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getTotalOfBorrowedGallon: async (req, res) => {
      const { customer_id } = req.params;
      console.log("customer_idcustomer_id", customer_id);
      const admin = getAdminId(req)?.toString();

      const { data, error } = await query.getTotalOfBorrowedGallon({
        admin,
        customer_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "customer's total borrowed gallons",
          data,
          "get_total_borrowed"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_total_borrowed"
        );
      }
    },
    getBorrowedGallonsByCustomer: async (req, res) => {
      const admin = getAdminId(req);
      const { customer_id } = req.params;
      const { data, error } = await query.getBorrowedGallonsByCustomer({
        admin_id: admin,
        customer_id,
      });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "customer's borrowed gallons",
          data,
          "get_borrowed_by_customer"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_borrowed_by_customer"
        );
      }
    },
  };
};
