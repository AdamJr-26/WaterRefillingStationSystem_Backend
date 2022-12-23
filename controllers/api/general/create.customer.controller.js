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
      console.log("create customer files", req.files);
      var { data: object, image } = req.body;
      const user = req.user;
      const admin = getAdminId(req);
      const payload = {
        admin,
        ...JSON.parse(object),
      };
      console.log("objectobjectobject",object)
      const file = JSON.parse(image);
      if (object) {
        const { data, error } = await transaction.createCustomer(
          file,
          payload,
          user
        );
        console.log("data", data);
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
