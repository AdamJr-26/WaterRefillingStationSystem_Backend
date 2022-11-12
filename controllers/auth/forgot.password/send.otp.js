module.exports = (
  mutation,
  query,
  crypto,
  clientCofing,
  responseUtil,
  sendOTP
) => {
  return {
    sentOTP: async (req, res) => {
      const { gmail } = req.body;
      console.log(gmail);

      // create random string
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
        const { data, error } = await query.isAdminExistAndVerified({
          gmail,
        });

        if (error) {
          responseUtil.generateServerErrorCode(
            res,
            400,
            error,
            "SOMETHING WENT WRONG",
            "forgot_password_admin"
          );
        } else if (data && !error) {
          const token = crypto.randomBytes(3).toString("hex");
          const userId = data.admin._id;

          //   store it to db
          const { otp, error } = await mutation.createOtp({
            gmail,
            token,
            userId,
          });
          console.log("error creaetOtp", error);
          const receiver = data?.admin.gmail;
          const firstname = data.admin.firstname;
          const userOtp = otp.token;
          if (otp && !error) {
            // const link = `${req.protocol}://${req.hostname}:${clientCofing.port}/set-new-password/?id=${userId}&token=${token}`;
            console.log("userOtp", userOtp);
            await sendOTP({
              receiver: receiver,
              firstname: firstname,
              subject: "Forgot Passwort OTP",
              title: "One Time Password",
              content:
                "This is your one time password, it will be expired around 3 minutes.",
              otp: userOtp,
            });
            responseUtil.generateServerResponse(
              res,
              201,
              "Forgot password has been sent to your email",
              "Please do have a check in your email",
              {success: true},
              "forgot_password_admin"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Error",
              "SOMETHING WENT WRONG",
              "forgot_password_admin"
            );
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            error,
            "SOMETHING WENT WRONG",
            "forgot_password_admin"
          );
        }
      }
    },
  };
};
