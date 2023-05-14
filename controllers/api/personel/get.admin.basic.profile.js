module.exports = (query, responseUtil, getAdminId) => {
  return {
    getAdminBasicInfo: async (req, res) => {
      const admin = getAdminId(req);
      // getAdminBasicInfo
      console.log("admin--->", admin)
      const { data, error } = await query.getAdminBasicInfo(admin);
      // console.log("errrrrr", error)
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
