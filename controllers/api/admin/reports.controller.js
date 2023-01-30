module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getPurchasesReport: async (req, res) => {
      const admin = getAdminId(req);
      const { date } = req.params;
      const { data, error } = await query.getPurchasesReport({ admin, date });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "fetching purchases reports",
          data,
          "get_reports_purchases"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_purchases_reports"
        );
      }
    },
  };
};
