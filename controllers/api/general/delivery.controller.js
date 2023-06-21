module.exports = (query, mutation, transaction, getAdminId, responseUtil) => {
  return {
    cancelDelivery: async (req, res) => {
      const { delivery_id } = req.params;
      const admin = getAdminId(req);
      const { data, error } = await mutation.cancelDelivery({
        admin,
        delivery_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "You just finished the delivery.",
          data,
          "finish_delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "cancel_delivery"
        );
      }
    },
    finishDelivery: async (req, res) => {
      const admin = getAdminId(req);
      const personnel_id = req.user?._id;
      const { delivery_id } = req.params;
      const { data, error } = await transaction.finishDelivery({
        admin,
        delivery_id,
        personnel_id,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "You just cancelled the delivery.",
          data,
          "finish_delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "finish_delivery"
        );
      }
    },
    getDeliveryProgress: async (req, res) => {
      const { delivery_id } = req.params;
      const admin = getAdminId(req);
      const { data, error } = await query.getDeliveryProgress({
        delivery_id,
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "summary of a delivery",
          data,
          "summary_of_delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "getting summary of a delivery failed, please try again",
          "summary_of_delivery"
        );
      }
    },
    recommendedLoad: async (req, res) => {
      try {
        // const data = await
        const admin = getAdminId(req);
        const personnel = req.user._id;
        const { vehicle } = req.params;
        const data = await query.recommendedLoad({ vehicle, admin, personnel });
        console.log("data->>>>>>>>>>", JSON.stringify(data));
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "Recommended deliery load.",
          data,
          "delivery_load"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error,
          error.message,
          "delivery_load"
        );
      }
    },
    deliveryRoutesDetails: async (req, res) => {
      try {
        // const data = await
        const admin = getAdminId(req);

        const { delivery } = req.params;
        const data = await query.deliveryRoutesDetails({ delivery });
        console.log("data->>>>>>>>>>", JSON.stringify(data));
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "Delivery routes",
          data,
          "delivery_routes"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error,
          error.message,
          "delivery_routes"
        );
      }
    },
  };
};
