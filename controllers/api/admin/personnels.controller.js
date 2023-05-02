module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getPersonels: async (req, res) => {
      const adminId = req.user?._id;
      const { limit, page } = req.params;

      const personels = await query.getPersonelsByAdminId({
        adminId,
        limit,
        page,
      });

      if (personels?.data && !personels?.error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "fetching delivery personels",
          personels?.data,
          "get_delivery_personels"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_delivery_personels"
        );
      }
    },
    getPersonnelsSalesAchievements: async (req, res) => {
      const admin = getAdminId(req);
      const { date, top } = req.params;
      const { data, error } = await query.getPersonnelsSalesAchievements({
        admin,
        date,
        top,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "fetching purchases sales achievement",
          data,
          "customers_sales_achievement"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "customers_sales_achievement"
        );
      }
    },
  };
};
