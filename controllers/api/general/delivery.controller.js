module.exports = (query, mutation, getAdminId, responseUtil) => {
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
          "You just cancelled the delivery.",
          { data: data?._id },
          "cancel_delivery"
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
  };
};
