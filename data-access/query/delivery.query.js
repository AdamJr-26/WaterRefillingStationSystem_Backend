module.exports = (Delivery) => {
  return {
    getPersonelDelivery: async (payload, selected) => {
      try {
        const filter = {
          delivery_personel: payload?.delivery_personel,
        };
        const data = await Delivery.findOne(filter).select(selected).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    // this the not approved yet delivery
    getPopulatedDeliveries: async (payload) => {
      try {
        const filter = {
          admin: payload?.admin,
          approved: payload?.isApproved,
        };
        const data = await Delivery.find(filter)
          .populate([
            {
              path: "delivery_personel",
              model: "Personel",
              select: "firstname lastname contact_number ",
            },
            {
              path: "vehicle",
              model: "Vehicle",
              select: "vehicle_name vehicle_id ",
            },
            {
              path: "delivery_items.gallon",
              model: "Gallon",
              select: "name liter",
            },
          ])
          .exec();
        // check if all refs are populate using model.field instanceofObjectId
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getPopulatedDeliveriesByPersonel: async (payload) => {
      try {
        const filter = {
          admin: payload?.admin,
          delivery_personel: payload?.delivery_personel,
          returned: payload?.isReturned,
          canceled : payload?.isCanceled,
        };
        const data = await Delivery.findOne(filter)
          .populate([
            {
              path: "vehicle",
              model: "Vehicle",
              select: "vehicle_name vehicle_id vehicle_image",
            },
            {
              path: "delivery_items.gallon",
              model: "Gallon",
              select: "name liter gallon_image",
            },
          ])
          .exec();
        // check if all refs are populate using model.field instanceofObjectId
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
