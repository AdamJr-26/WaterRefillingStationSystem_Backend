module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getReturnReceipts: async (req, res) => {
      const admin = getAdminId(req);
      const { customer, from, to, page, limit } = req.params;
      console.log("page------", page)
      const { data, error } = await query.getReturnsHistory({
        admin,
        customer,
        from,
        to,
        page,
        limit,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "return histories",
          data,
          "get_return_history"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "getting summary of a delivery failed, please try again",
          "get_return_history"
        );
      }
    },
  };
};
