module.exports = (mutation, query, responseUtil, encryptPassword) => {
  return {
    setNewPassWordAdmin: async (req, res) => {
      const { userId, token, password } = req.body;
      // all fields are required
      if (userId && token && password) {
        // check if token and id are existing in db then get the gmail to change password.
        const { OTPDoc, error } = await query.getTokenAndUserId({
          userId,
          token,
        });
        // if true then update password
        if (OTPDoc && !error) {
          const { gmail } = OTPDoc;
          const hashed_password = await encryptPassword(password, 10);
          const admin = await mutation.updateAdminPassword({
            gmail,
            hashed_password,
          });
          if (admin?.data && !admin?.error) {
            // if success then delete that token immediately.
            const otpDoc = await mutation.deleteOneOTP({
              userId,
            });
            if (otpDoc?.deleteOTPDoc.acknowledged && !otpDoc?.error) {
              responseUtil.generateServerResponse(
                res,
                200,
                "Set New Password Successfully",
                "You just change your password",
                { success: true },
                "set_new_password"
              );
            } else {
              responseUtil.generateServerErrorCode(
                res,
                400,
                "Oops!",
                "Sorry something went wrong.",
                "set_new_password"
              );
            }
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Oops!",
              "Sorry something went wrong.",
              "set_new_password"
            );
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Expired",
            "Your token are expired, please request again.",
            "set_new_password"
          );
        }
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Empty fields",
          "Try to open the link again from your",
          "set_new_password"
        );
      }
    },
  };
};
