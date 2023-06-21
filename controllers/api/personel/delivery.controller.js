module.exports = (query, mutation, responseUtil, getAdminId) => {
  return {
    createDelivery: async (req, res) => {
      const body = req.body;
      const admin = getAdminId(req);
      const delivery_personel = req.user?._id;
      const vehicle = body?.vehicle_id;
      const selectedRoutes = body?.selectedRoutes;
      const items = body?.items;
      const updatedItems = items.map((item) => {
        return {
          gallon: item.gallon.toString(),
          total: item?.total,
        };
      });
      const control = await query.getControls({ admin });

      const payload = {
        admin,
        delivery_personel,
        vehicle,
        delivery_items: updatedItems,
        dispatched_items: items,
        selectedRoutes: selectedRoutes,
      };
      if (control?.autoAcceptDelivery) {
        payload["approved"] = true;
        payload["approved_date"] = Math.floor(new Date().valueOf() / 1000);
      }

      // before everything, first, we need to check if all gallons are still available.
      // const ArrayOfId = [];
      // const ArrayOfTotal = [];
      // for (let i = 0; i < items?.length; i++) {
      //   if (items[i]?.gallon && items[i]?.total) {
      //     ArrayOfId.push(items[i].gallon);
      //     ArrayOfTotal.push(items[i].total);
      //   }
      // }
      // it means all gallons are available
      // now  check if the delivery personel has already delivery;
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
    getPersonelDelivery: async (req, res) => {
      const admin = getAdminId(req);
      const isReturned = false;
      const delivery_personel = req?.user?._id?.toString();
      const { data, error } = await query.getPopulatedDeliveriesByPersonel({
        admin,
        delivery_personel,
        isReturned,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetch delivery",
          data,
          "delivery"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "fetch delivery Failed",
          "delivery"
        );
      }
    },
    getRecentDeliveries: async (req, res) => {
      const personel_id = req.user?._id;
      const admin = getAdminId(req);
      const { data, error } = await query.getRecentDeliveries({
        personel_id,
        admin,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetch recent deliveries",
          data,
          "recent_deliveries"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "fetch deliveries Failed",
          "recent_deliveries"
        );
      }
    },
  };
};
