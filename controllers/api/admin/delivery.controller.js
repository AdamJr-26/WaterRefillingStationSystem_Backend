module.exports = (query, mutation, transaction, responseUtil, getAdminId) => {
  return {
    getPopulatedDeliveries: async (req, res) => {
      const admin = getAdminId(req);
      const isApproved = false;
      const { data, error } = await query.getPopulatedDeliveries({
        admin: admin,
        isApproved,
      });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get deliveries",
          data,
          "deliveries"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "deliveries"
        );
      }
    },

    acceptDelivery: async (req, res) => {
      const admin = getAdminId(req);
      const payload = req.body;
      const { success, error } = await transaction.acceptDelivery(payload);
      console.log("error", error);
      if (success && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "accept request delivery successfully",
          success,
          "accept delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "accept delivery"
        );
      }
    },
    getOngoingDeliveries: async (req, res) => {
      const admin = getAdminId(req);
      const { limit, page } = req.params;
      const { data, error } = await query.getOngoingDeliveries({
        limit,
        page,
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "ge all ongoing deliveries",
          data,
          "ongoing_delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "ongoing_delivery"
        );
      }
    },
    getFinishedDeliveries: async (req, res) => {
      const admin = getAdminId(req);
      const { page, limit } = req.params;

      const { data, error } = await query.getFinishedDeliveries({
        admin,
        limit,
        page,
      });
      console.log("error:", error);
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get finished deliveries",
          data,
          "finished_delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "finished_delivery"
        );
      }
    },
  };
};
