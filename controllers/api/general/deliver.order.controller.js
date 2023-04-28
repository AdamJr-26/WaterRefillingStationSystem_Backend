module.exports = (
  query,
  mutation,
  transaction,
  getAdminId,
  responseUtil,
  sendReceipt,
  format
) => {
  return {
    deliverOrder: async (req, res) => {
      const admin = getAdminId(req);
      const personel = req.user?._id?.toString();
      const body = req.body;
      const debt_payment = body?.total_payment - body.order_to_pay;
      const schedule_id = body?.schedule_id;
      const purchase_items = body.items;

      // first get verified delivery' id

      // const delivery = await query.getDeliveryId(personel); // get delivery id
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

        let totalItemEnough = 0;
        for (let p = 0; p < purchase_items.length; p++) {
          const delivery_item =
            await query.getAllItemsGreaterThanEqualOrderedItem({
              delivery_id,
              purchase_item: purchase_items[p],
            });

          if (delivery_item?.data?.delivery_items.length) {
            totalItemEnough = totalItemEnough + 1;
          }
        }

        if (totalItemEnough === purchase_items.length) {
          // create purchase and all
          const purchase = {
            admin,
            personel,
            schedule_id,
            delivery: delivery_id,
            ...body,
            debt_payment: debt_payment,
          };
          console.log("[[purchasepurchasepurchasepurchase]]", purchase);
          const { data, error } =
            await transaction.deliverOrderByScheduleTransaction({
              purchase,
            });
          if (data?.success && !error) {
            console.log("[DATA------------]", JSON.stringify(data));
            // send receipt, oops paano kung wala schedule?
            const { data: receiptData, error: receiptError } =
              await query.getScheduleDetails({
                admin,
                schedule_id,
                items: data?.purchase?.items,
              });
            console.log("data-------", JSON.stringify(data));
            if (receiptData.length && !receiptError) {
              await sendReceipt({
                receiver: receiptData[0]?.customer[0]?.gmail,
                subject: "Confirmation of Your Recent Order Delivery",
                wrs_name: receiptData[0]?.admin[0].wrs_name,
                personnel_name: `${receiptData[0]?.personnel[0].firstname} ${receiptData[0]?.personnel[0]?.lastname}`,
                address: `${receiptData[0]?.customer[0].address.street} ${receiptData[0]?.customer[0]?.address.barangay} ${receiptData[0]?.customer[0].address.municipal_city}`,
                date_of_delivery: format(new Date(), "MMMM d, yyyy"),
                items: receiptData[0]?.purchasedItems,
                debt_payment: data?.purchase.debt_payment,
                total_payment: data?.purchase.total_payment,
                from: receiptData[0]?.personnel[0].gmail
              });
            }

            responseUtil.generateServerErrorCode(
              res,
              200,
              "Deliver order successfully",
              "Deliered successfully",
              data,
              "delivery_order"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Deliver order failed",
              "Please check the payment.",
              "delivery_order"
            );
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Deliver order failed",
            "Delivery items are not enought for this purchase.",
            "delivery_order"
          );
        }
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "No delivery",
          "No delivery was found; please create one.",
          "delivery_order"
        );
      }
    },

    // no schedule.
    // deliverOrderNoSchedule: async (req, res) => {
    //   const admin = getAdminId(req);
    //   const personel = req.user?._id?.toString();
    //   const body = req.body;
    //   const debt_payment = body?.total_payment - body.order_to_pay;
    //   const purchase_items = body.items;

    //   const delivery = await query.getApprovedDelivery(
    //     {
    //       delivery_personel: personel,
    //     },
    //     ["_id"]
    //   );
    //   const delivery_id = delivery?.data?._id;
    //   // check if deliver is existing
    //   if (delivery_id && !delivery.error) {
    //     let totalItemEnough = 0;
    //     for (let p = 0; p < purchase_items.length; p++) {
    //       const delivery_item =
    //         await query.getAllItemsGreaterThanEqualOrderedItem({
    //           delivery_id,
    //           purchase_item: purchase_items[p],
    //         });
    //       if (delivery_item?.data[0]?.delivery_items.length) {
    //         totalItemEnough = totalItemEnough + 1;
    //       }
    //     }
    //     if (totalItemEnough === purchase_items.length) {
    //       const purchase = {
    //         admin,
    //         personel,
    //         delivery: delivery_id,
    //         ...body,
    //         debt_payment: debt_payment,
    //       };

    //     } else {
    //       responseUtil.generateServerErrorCode(
    //         res,
    //         400,
    //         "Deliver order failed",
    //         "Delivery items are not enought for this purchase.",
    //         "delivery_order"
    //       );
    //     }
    //   } else {
    //     responseUtil.generateServerErrorCode(
    //       res,
    //       400,
    //       "No delivery",
    //       "Deliver order failed",
    //       "delivery_order"
    //     );
    //   }
    // },
  };
};
