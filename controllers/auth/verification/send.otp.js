module.exports = (
  mutation,
  query,
  crypto,
  clientCofing,
  responseUtil,
  sendOTP
) => {
  return {
    sendOTP: async (req, res) => {
      const { gmail } = req.body;
      console.log("gmail....", gmail);

      // create random string
      if (!gmail) {
        // email should not be empty
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Email should not be empty",
          "Please check the email input.",
          "forgot_password"
        );
      } else {
        // check if the email is existing
        // if yes
        // create randome string using token
        // send to the user with _id, token,gmail
        // link - localhost:3000/set-new-password/:id/
        const { personel, personel_error } =
          await query.checkIfPersonelIsExisting({
            gmail,
          });
        console.log("personel", personel);
        if (personel_error) {
          responseUtil.generateServerErrorCode(
            res,
            400,
            personel_error,
            "SOMETHING WENT WRONG",
            "forgot_password"
          );
        } else if (personel && !personel_error) {
          const token = crypto.randomBytes(3).toString("hex");
          const userId = personel?._id;

          //   store it to db
          const { otp, error } = await mutation.createOtp({
            gmail,
            token,
            userId,
          });
          console.log("error creaetOtp", error);
          const receiver = personel?.gmail;
          const firstname = personel?.firstname;
          const userOtp = otp.token;
          if (otp && !error) {
            // const link = `${req.protocol}://${req.hostname}:${clientCofing.port}/set-new-password/?id=${userId}&token=${token}`;
            console.log("userOtp", userOtp);
            await sendOTP({
              receiver: receiver,
              firstname: firstname,
              subject: "Verify Account",
              title: "One Time Password",
              content:
                "This is your one time password, it will be expired in 3 minutes.",
              otp: userOtp,
            });
            responseUtil.generateServerResponse(
              res,
              201,
              "Forgot password has been sent to your email",
              "Please do have a check in your email",
              { success: true },
              "forgot_password"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Error",
              "SOMETHING WENT WRONG",
              "forgot_password"
            );
          }
        } else if (!personel && !personel_error) {
          responseUtil.generateServerErrorCode(
            res,
            409,
            "Error",
            "We can't find a user with that email address.",
            "forgot_password"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "SOMETHING WENT WRONG",
            "forgot_password"
          );
        }
      }
    },
  };
};
