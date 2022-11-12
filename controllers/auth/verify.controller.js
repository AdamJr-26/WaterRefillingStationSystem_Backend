module.exports = (mutation, query, responseUtil) => {
  return {
    verifyAdmin: async (req, res) => {
      const { id } = req.query;
      const isVerified = await query.checkAdminIfNotVerified(id);
      //   error
      console.log(isVerified?.data?.verify);
      if (isVerified?.error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          isVerified?.error,
          "Something went wrong while verifying your account.",
          "verify_admin"
        );
      }
      //   if already verified
      else if (isVerified?.data?.verify) {
        responseUtil.generateServerResponse(
          res,
          200,
          "Admin already verified",
          "already verified admin.",
          "data is confidential",
          "verify_admin"
        );
      } else {
        //  if not verified ye, verify now
        const { data, error } = await mutation.verifyAdmin(id);
        if (data && !error) {
          // verified
          responseUtil.generateServerResponse(
            res,
            201,
            "You have successfully verified account",
            "Account has been verified.",
            "data is confidential",
            "verify_admin"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "error",
            "Something went wrong while verifying your account.",
            "verify_admin"
          );
        }
      }
    },
    verifyPersonel: async (req, res) => {
      // check if that email is existing,
      // if already verified then response message: this email is already verified nothing to do more here.
      // check if the otp is still existing
      const { gmail, otp } = req.body;
      if ((gmail, otp)) {
        const { personel, personel_error } =
          await query.checkIfPersonelIsExisting({ gmail });
        if (personel?.verified && !personel_error) {
          // response that this email is already verified.
          responseUtil.generateServerResponse(
            res,
            201,
            "Already Verified",
            "This email is already verified",
            "data is confidential",
            "verify_personel"
          );
        } else if (personel?.verified === false && !personel_error) {
          // proceed to verify the user
          // check if the token is still available.
          const { getEmailAndTokenData, getEmailAndTokenError } =
            await query.getEmailAndToken({ gmail, token: otp });
          if (
            getEmailAndTokenData?.gmail === gmail &&
            getEmailAndTokenData?.token &&
            !getEmailAndTokenError
          ) {
            // verify the user
            const { personelData, personelError } =
              await mutation.verifyPersonel(gmail);
            if (personelData && !personelError) {
              // success
              responseUtil.generateServerResponse(
                res,
                201,
                "Verified",
                "Congratulation you are now verified.",
                {gmail: personelData?.gmail },
                "verify_personel"
              );
            }
          } else {
            // cannot find the user ehe, kahit mag error sisihin si user HAHAHAH.
            responseUtil.generateServerErrorCode(
              res,
              400,
              "error",
              "Cannot find your account",
              "verify_personel"
            );
          }
        } else {
          // error
          responseUtil.generateServerErrorCode(
            res,
            400,
            "error",
            "Cannot find your account",
            "verify_personel"
          );
        }
      }
    },
  };
};
