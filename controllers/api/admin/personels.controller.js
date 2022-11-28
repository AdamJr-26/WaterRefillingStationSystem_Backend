module.exports = (query,responseUtil) => {
  return {
    getPersonels: async (req, res) => {
      const adminId = req.user?._id;
      const personels = await query.getPersonelsByAdminId({ adminId });

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
  };
};
