module.exports = (query, responseUtil, getAdminId) => {
  return {
    getTodaysCashTransaction: async (req, res) => {
      const { date } = req.params;
      const admin = getAdminId(req);
      const { data, error } = await query.getTodaysCashTransaction({
        admin,
        date,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "Dashboard query today's cash received.",
          "success",
          data,
          "admin.dashboard.controller"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Dashboard query today's cash received ERROR",
          "Something went wrong, please try again.",
          "admin.dashboard.controller"
        );
      }
    },
  };
};
