module.exports = (query, mutation, responseUtil, getAdminId) => {
  return {
    createCreditLimit: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const data = await mutation.createCreditLimit({
          admin,
          payload: req.body,
        });
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "Created credit limit successfully",
          data,
          "credit_limit"
        );
        console.log("req.body", req.body);
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "credit_limit"
        );
      }
    },
    deleteCreditLimit: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const { id } = req.params;
        const data = await mutation.deleteCreditLimit({
          admin,
          creditId: id,
        });
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "deleted credit limit successfully",
          data,
          "credit_limit"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "credit_limit"
        );
      }
    },
    getCreditLimits: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const data = await query.getCreditLimits({
          admin,
        });
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "Get credit limit successfully",
          data,
          "credit_limit"
        );
        console.log("req.body", req.body);
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "credit_limit"
        );
      }
    },
    
  };
};
