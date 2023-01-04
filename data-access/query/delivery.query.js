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

    getApprovedDelivery: async (payload, selected) => {
      //am not gonna use it again? fuck
      try {
        const filter = {
          delivery_personel: payload?.delivery_personel,
          approved: true,
        };
        const data = await Delivery.findOne(filter).select(selected).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    // not been used. violation: (do not create future feature)
    getAllItemsGreaterThanEqualOrderedItem: async ({
      delivery_id,
      purchase_item,
    }) => {
      const total_orders =
        Number(purchase_item.orders) + Number(purchase_item.free);
      console.log("total_orders", total_orders);
      try {
        const pipelines = [
          {
            $match: {
              _id: delivery_id,
            },
          },
          {
            $project: {
              // _id: delivery_id,
              delivery_items: {
                $filter: {
                  input: "$delivery_items",
                  as: "item",
                  cond: {
                    $and: [
                      { $gte: ["$$item.total", total_orders] },
                      {
                        $eq: [
                          "$$item.gallon",
                          { $toObjectId: purchase_item.gallon },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        ];
        const data = await Delivery.aggregate(pipelines);
        return { data: data[0] };
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
          canceled: payload?.isCanceled,
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
