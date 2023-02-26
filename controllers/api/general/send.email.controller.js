module.exports = (
  query,
  mutation,
  getAdminId,
  sendNotifyForDelivery,
  responseUtil,
  format
) => {
  return {
    sendEmailToNotifyCustomerForDelivery: async (req, res) => {
      const { schedule_id } = req.params; //email
      const admin = getAdminId(req); // admin id
      const { data, error } = await query.getScheduleDetails({
        admin,
        schedule_id,
      });

      if (data && !error) {
        try {
          // change schedule if notified to true.
          const { data: notifiedData, error: notifiedError } =
            await mutation.setToNotified(schedule_id);
            
          if (notifiedData && !notifiedError) {
            await sendNotifyForDelivery({
              receiver: data[0]?.customer[0]?.gmail,
              subject: "Upcoming Delivery Notice for Order",
              wrs_name: data[0]?.admin[0].wrs_name,
              personnel_name: `${data[0]?.personnel[0].firstname} ${data[0]?.personnel[0]?.lastname}`,
              address: `${data[0]?.customer[0].address.street} ${data[0]?.customer[0]?.address.barangay} ${data[0]?.customer[0].address.municipal_city}`,
              order_details: data[0]?.total_items,
              date_of_scheduled: format(data[0]?.createdAt, "MMMM d, yyyy"),
              estimated_delivery_date: format(new Date(), "MMMM d, yyyy"),
            });
            responseUtil.generateServerResponse(
              res,
              201,
              "success",
              "Notification for customer.",
              { success: true },
              "send_notification_for_incoming_deliveries"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Error",
              "Oops something went wrong, please try again",
              "send_notification_for_incoming_deliveries"
            );
          }
        } catch (error) {
          console.log("sendNotifyForDelivery=>error", error);
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "Oops something went wrong, please try again",
            "send_notification_for_incoming_deliveries"
          );
        }
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "send_notification_for_incoming_deliveries"
        );
      }
    },
  };
};
