module.exports = (query, responseUtil, getAdminId) => {
  return {
    getAdminBasicInfo: async (req, res) => {
      const admin = getAdminId(req);
      // getAdminBasicInfo
      const { data, error } = await query.getAdminBasicInfo(admin);
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
