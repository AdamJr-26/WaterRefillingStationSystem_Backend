module.exports = (mutation, query, responseUtil) => {
  return {
    verifyAdmin: async (req, res) => {
      const { id } = req.query;
      const isVerified = await query.checkAdminIfNotVerified(id);

      //   error
      console.log(isVerified?.data?.verify)
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
        const {data, error} = await mutation.verifyAdmin(id);
        console.log("data",data, "error", error)
        if(data && !error){
          // verified
          responseUtil.generateServerResponse(
            res,
            201,
            "You have successfully verified account",
            "Account has been verified.",
            "data is confidential",
            "verify_admin"
          );
        }else{
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
  };
};
