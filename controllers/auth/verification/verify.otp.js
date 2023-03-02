module.exports = (query, responseUtil) => {
  return {
    verifyOTP: async (req, res) => {
      const { gmail, otp } = req.body;
      
      const { getEmailAndTokenData, getEmailAndTokenError } =
        await query.getEmailAndToken({ gmail, token: otp });
        
      if (getEmailAndTokenData && !getEmailAndTokenError) {
        if (getEmailAndTokenData.gmail && getEmailAndTokenData.token) {
          responseUtil.generateServerResponse(
            res,
            201,
            "success",
            "Verifying OTP successfully",
            getEmailAndTokenData,
            "verify_otp"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "Verified failed",
            "verify_otp"
          );
        }
      }else if(!getEmailAndTokenData && !getEmailAndTokenError){
        responseUtil.generateServerErrorCode(
          res,
          409,
          "Error",
          "Please enter a valid OTP",
          "verify_otp"
        );
      }
      else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "SOMETHING WENT WRONG",
          "verify_otp"
        );
        
      }
    },
  };
};
