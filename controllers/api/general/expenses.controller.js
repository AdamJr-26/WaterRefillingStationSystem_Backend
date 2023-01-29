module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    createNewReportExpense: async (req, res) => {
      const payload = req.body;
      const admin = getAdminId(req);
      const { data, error } = await mutation.createNewReportExpense({
        admin,
        payload,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "new expense",
          data,
          "new_expense"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get customer failed, please try again",
          "new_expense"
        );
      }
    },
  };
};
