module.exports = (query, mutation, responseUtil, getAdminId) => {
  return {
    createDelivery: async (req, res) => {
      const body = req.body;
      const admin = getAdminId(req);
      const delivery_personel = req.user?._id;
      const vehicle = body?.vehicle_id;
      const items = body?.items;
      const payload = {
        admin,
        delivery_personel,
        vehicle,
        delivery_items: items,
      };
      //   check if the delivery personel has already delivery;
      const isDeliveryExists = await query.getPersonelDelivery(
        {
          delivery_personel: delivery_personel,
        },
        ["_id", "admin", "delivery_personel"]
      );
      if (isDeliveryExists?.data && !isDeliveryExists?.error) {
        // response 409 -conflict dahil meron nang delivery.
        responseUtil.generateServerErrorCode(
          res,
          409,
          "Error",
          "create delivery Failed",
          "delivery"
        );
      } else {
        const { data, error } = await mutation.createDelivery({ payload });
        if (data && !error) {
          responseUtil.generateServerResponse(
            res,
            201,
            "success",
            "created delivery",
            "no data to show",
            "delivery"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "create delivery Failed",
            "delivery"
          );
        }
      }
    },
  };
};
