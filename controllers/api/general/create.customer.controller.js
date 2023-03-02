module.exports = (
  query,
  mutation,
  responseUtil,
  uploadImage,
  getAdminId,
  transaction
) => {
  return {
    createCustomer: async (req, res) => {
      var { data: object, image } = req.body;
      const user = req.user;
      const admin = getAdminId(req);
      const payload = {
        admin,
        ...JSON.parse(object),
      };

      const files = JSON.parse(image);
      if (object) {
        const { data, error } = await transaction.createCustomer(
          files,
          payload,
          user
        );
        
        if (data && !error) {
          responseUtil.generateServerResponse(
            res,
            201,
            "success",
            "created customer",
            "no data to show",
            "create_customer"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "create customer , please try again",
            "create_customer"
          );
        }
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "create customer failed, please try again",
          "create_customer"
        );
      }
    },
  };
};
