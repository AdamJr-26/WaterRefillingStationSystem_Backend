module.exports = (query, responseUtil) => {
  return {
    getAdminBasicInfo: async (req, res) => {
      const admin = req.user?.admin;
      // getAdminBasicInfo
      const { data, error } = await query.getAdminBasicInfo(admin.toString());
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "admin basic info",
          data,
          "get_admin_info"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get admin basic info failed.",
          "get_admin_info"
        );
      }
    },
  };
};
