
// NOT USED.
module.exports = (sendSMS, responseUtil) => {
  return {
    sendDeliveryNotification: async (req, res) => {
      try {
        // fetch number of the user.
        // and number of the wrs.
        const { recipient } = req.params;
        const welcomeMessage =
          "[Company Name] greetings! Bal: [Balance]. Item [Borrowed Item] due [Due Date]. Purchased [Purchase Receipt] on [Date of Purchase]. Your delivery will arrive [Delivery Date]. Contact us for any questions.";

        sendSMS(recipient, welcomeMessage);

        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "Delivery notification.",
          data,
          "send_delivery_notification"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "send_delivery_notification"
        );
      }
    },
  };
};
