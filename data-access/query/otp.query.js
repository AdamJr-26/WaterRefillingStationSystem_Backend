module.exports = (OTP) => {
  return {
    checkIfGmailIsExistingInOTP: async (gmail) => {
      try {
        const OTPDoc = await OTP.findOne({ gmail: gmail }).exec();
        return { OTPDoc };
      } catch (OTPError) {
        return { OTPError };
      }
    },
    getTokenAndUserId: async ({ userId, token }) => {
      try {
        const OTPDoc = await OTP.findOne({ userId, token }).exec();
        return { OTPDoc };
      } catch (error) {
        return { error };
      }
    },
    getEmailAndToken: async ({ gmail, token }) => {
      try {
        const getEmailAndTokenData = await OTP.findOne({ gmail, token }).exec();
        return { getEmailAndTokenData };
      } catch (getEmailAndTokenError) {
        return { getEmailAndTokenError };
      }
    },

  };
};
