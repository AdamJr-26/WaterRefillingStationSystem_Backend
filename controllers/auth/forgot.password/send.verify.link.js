module.exports = (
  mutation,
  query,
  crypto,
  clientCofing,
  responseUtil,
  sendEmail
) => {
  return {
    sendResetVerifyLink: async (req, res) => {
      const { gmail } = req.body;
      console.log(gmail);

      if (!gmail) {
        // email should not be empty
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Email should not be empty",
          "Please check the email input.",
          "forgot_password_admin"
        );
      } else {
        // check if the email is existing
        // if yes
        // create randome string using token
        // send to the user with _id, token,gmail
        // link - localhost:3000/set-new-password/:id/

        // check if gmail is existing.
        const { data, error } = await query.isAdminExistAndVerified({
          gmail,
        });
        // if error happened
        if (error) {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Oops",
            "SOMETHING WENT WRONG",
            "forgot_password_admin"
          );
        }
        // if gmail is existing
        else if (data && !error) {
          // create random string
          const token = crypto.randomBytes(64).toString("hex");
          const userId = data.admin._id;

          //   before storing new to db, server will check the otp collection if that gmail is already existing in that otp collection.
          const { OTPDoc, OTPError } = await query.checkIfGmailIsExistingInOTP(
            gmail
          );
          console.log("OTPDoc", OTPDoc);
          if (OTPDoc?.gmail && !OTPError) {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Please try again later",
              "Your token not expired yet, please check your email.",
              "forgot_password_admin"
            );
          }
          //   if that gmail not existing in otp collection then..
          else {
            //   store it to db
            const { otp, error } = await mutation.createOtp({
              gmail,
              token,
              userId,
            });
            const receiver = data?.admin.gmail;
            const firstname = data.admin.firstname;
            const userOtp = otp.token;
            if (otp && !error) {
              const link = `${req.protocol}://${req.hostname}:${clientCofing.port}/forgot-password/set-new-password/?id=${userId}&token=${token}`;
              await sendEmail(
                receiver, //gmail
                firstname,
                link,
                "Forgot Password Verification",
                "Thank you for registering!",
                "Click the link to reset your password. Please be advised the ID and token attached to this link will be exprired in 3 minutes",
                "this email is used by wrss developer", //descrtion
                "Reset Password" // button label
              );
              responseUtil.generateServerResponse(
                res,
                201,
                "Forgot password has been sent to your email",
                "Please do have a check in your email",
                { success: true, gmail: receiver },
                "forgot_password_admin"
              );
            } else {
              responseUtil.generateServerErrorCode(
                res,
                400,
                "Oops",
                "SOMETHING WENT WRONG",
                "forgot_password_admin"
              );
            }
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Email Invalid",
            "Can't find your account",
            "forgot_password_admin"
          );
        }
      }
    },
  };
};
