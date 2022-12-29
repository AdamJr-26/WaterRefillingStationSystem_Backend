module.exports = (query, mutation, transaction, getAdminId, responseUtil) => {
  return {
    deliverOrder: async (req, res) => {
      const admin = getAdminId(req);
      const personel = req.user?._id?.toString();
      const body = req.body;
      const debt_payment = body?.total_payment - body.order_to_pay;
      const schedule_id = body?.schedule_id;
      const purchase_items = body.items;

      // first get verified delivery' id

      // const delivery = await query.getDeliveryId(personel); // get delivery it
      const delivery = await query.getApprovedDelivery(
        {
          delivery_personel: personel,
        },
        ["_id"]
      );
      const delivery_id = delivery?.data?._id;
      // check if deliver is existing
      if (delivery_id && !delivery.error) {
        // checks all items are enough for orders


        // let totalItemEnough = 0;
        // for (let p = 0; p < purchase_items.length; p++) {
        //   const delivery_item =
        //     await query.getAllItemsGreaterThanEqualOrderedItem({
        //       delivery_id,
        //       purchase_item: purchase_items[p],
        //     });
        //   if (delivery_item.data[0].delivery_items.length) {
        //     totalItemEnough = totalItemEnough + 1;
        //   }
        // }
        // if (totalItemEnough === purchase_items.length) {
        //   // create purchase and all
        //   const purchase = {
        //     admin,
        //     personel,
        //     schedule_id,
        //     delivery: delivery_id,
        //     ...body,
        //     debt_payment: debt_payment,
        //   };
        //   console.log("purchase", purchase);
        //   const { data, error } = await transaction.deliverOrderTransaction({
        //     purchase,
        //   });
        //   if (data && !error) {
        //     console.log("[data]", data);
        //   } else {
        //     console.log("[error]", error);
        //   }
        // } else {
        //   responseUtil.generateServerErrorCode(
        //     res,
        //     400,
        //     "Deliver order failed",
        //     "Delivery items are not enought for this purchase.",
        //     "delivery_order"
        //   );
        // }
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "No delivery",
          "Deliver order failed",
          "delivery_order"
        );
      }
    },
  };
};
